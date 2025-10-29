package com.revia.lastdance.mypage.controller;

import com.revia.lastdance.mypage.service.MypageService;
import com.revia.lastdance.signup.vo.UserVO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import jakarta.mail.MessagingException;
import java.io.IOException;
import java.util.Map;

@RestController
@RequestMapping("/api/mypage")
public class MypageController {

    @Autowired
    private MypageService mypageService;

    @GetMapping("/user/{userId}")
    public ResponseEntity<UserVO> getUserById(@PathVariable("userId") String userId) {
        UserVO user = mypageService.getUserById(userId);
        if (user != null) {
            return ResponseEntity.ok(user);
        } else {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }

    @PostMapping("/nickname")
    public ResponseEntity<String> updateNickname(@RequestBody UserVO userVO) {
        try {
            mypageService.updateUserNickname(userVO);
            return ResponseEntity.ok("Nickname updated successfully");
        } catch (IllegalArgumentException e) {
            return new ResponseEntity<>(e.getMessage(), HttpStatus.CONFLICT);
        }
    }

    @GetMapping("/check-nickname")
    public ResponseEntity<Boolean> checkNickname(@RequestParam String nickname, @RequestParam(required = false) String userId) {
        boolean available = mypageService.checkNicknameAvailability(nickname, userId);
        return ResponseEntity.ok(available);
    }

    @PostMapping("/password-reset/request")
    public ResponseEntity<String> requestPasswordReset(@RequestBody Map<String, String> payload) {
        String userEmail = payload.get("userEmail");
        if (userEmail == null || userEmail.isEmpty()) {
            return new ResponseEntity<>("Email is required", HttpStatus.BAD_REQUEST);
        }
        try {
            mypageService.requestPasswordReset(userEmail);
            return ResponseEntity.ok("Password reset email sent successfully");
        } catch (MessagingException e) {
            return new ResponseEntity<>("Failed to send email: " + e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @PostMapping("/password-reset/confirm")
    public ResponseEntity<String> confirmPasswordReset(@RequestBody Map<String, String> payload) {
        String userEmail = payload.get("userEmail");
        String emailCode = payload.get("emailCode");
        String newPassword = payload.get("newPassword");

        if (userEmail == null || userEmail.isEmpty() || emailCode == null || emailCode.isEmpty() || newPassword == null || newPassword.isEmpty()) {
            return new ResponseEntity<>("Email, code, and new password are required", HttpStatus.BAD_REQUEST);
        }

        boolean success = mypageService.resetPassword(userEmail, emailCode, newPassword);
        if (success) {
            return ResponseEntity.ok("Password reset successfully");
        } else {
            return new ResponseEntity<>("Invalid or expired verification code", HttpStatus.BAD_REQUEST);
        }
    }

    @PostMapping("/profile-image/{userId}")
    public ResponseEntity<Map<String, String>> uploadProfileImage(@PathVariable("userId") String userId,
                                                                  @RequestParam("file") MultipartFile file) {
        try {
            String userImgUrl = mypageService.uploadProfileImage(userId, file);
            return ResponseEntity.ok(Map.of("userImgUrl", userImgUrl));
        } catch (IOException e) {
            return new ResponseEntity<>(Map.of("message", "Failed to upload profile image: " + e.getMessage()), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @PostMapping("/delete-account/request-code")
    public ResponseEntity<String> requestDeleteAccountCode(@RequestBody Map<String, String> payload) {
        String userEmail = payload.get("userEmail");
        if (userEmail == null || userEmail.isEmpty()) {
            return new ResponseEntity<>("Email is required", HttpStatus.BAD_REQUEST);
        }
        try {
            mypageService.requestDeleteAccountCode(userEmail);
            return ResponseEntity.ok("Account deletion verification email sent successfully");
        } catch (MessagingException e) {
            return new ResponseEntity<>("Failed to send email: " + e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @DeleteMapping("/delete-account/{userId}")
    public ResponseEntity<String> deleteAccount(@PathVariable("userId") String userId,
                                                @RequestParam("emailCode") String emailCode) {
        try {
            mypageService.deleteAccount(userId, emailCode);
            return ResponseEntity.ok("Account deleted successfully.");
        } catch (IllegalArgumentException e) {
            return new ResponseEntity<>(e.getMessage(), HttpStatus.BAD_REQUEST);
        } catch (Exception e) {
            return new ResponseEntity<>("Failed to delete account: " + e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

}
