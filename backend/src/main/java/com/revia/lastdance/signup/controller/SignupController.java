package com.revia.lastdance.signup.controller;

import com.revia.lastdance.signup.service.SignupService;
import com.revia.lastdance.signup.vo.UserVO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/signup")
public class SignupController {

    @Autowired
    private SignupService signupService;

    // 회원가입 처리
    @PostMapping
    public ResponseEntity<String> registerUser(@RequestBody UserVO userVO) {
        if (signupService.isEmailDuplicated(userVO.getUserEmail())) {
            return new ResponseEntity<>("Email already registered", HttpStatus.CONFLICT);
        }
        if (signupService.isNicknameDuplicated(userVO.getUserNickname())) {
            return new ResponseEntity<>("Nickname already in use", HttpStatus.CONFLICT);
        }
        signupService.registerUser(userVO);
        return new ResponseEntity<>("User registered successfully", HttpStatus.CREATED);
    }

    // 이메일 중복 확인
    @GetMapping("/check-email")
    public ResponseEntity<Boolean> checkEmailDuplication(@RequestParam String email) {
        return new ResponseEntity<>(signupService.isEmailDuplicated(email), HttpStatus.OK);
    }

    // 닉네임 중복 확인
    @GetMapping("/check-nickname")
    public ResponseEntity<Map<String, Boolean>> checkNicknameDuplication(@RequestParam String nickname) {
        boolean isDuplicated = signupService.isNicknameDuplicated(nickname);
        return new ResponseEntity<>(Map.of("available", !isDuplicated), HttpStatus.OK);
    }

    // 이메일 인증 코드 전송
    @PostMapping("/send-verification-email")
    public ResponseEntity<String> sendVerificationEmail(@RequestBody Map<String, String> payload) {
        String userEmail = payload.get("userEmail");
        if (userEmail == null || userEmail.isEmpty()) {
            return new ResponseEntity<>("Email cannot be empty", HttpStatus.BAD_REQUEST);
        }
        signupService.sendVerificationEmail(userEmail);
        return new ResponseEntity<>("Verification email sent successfully", HttpStatus.OK);
    }

    // 이메일 인증 코드 확인
    @PostMapping("/verify-email")
    public ResponseEntity<Map<String, Boolean>> verifyEmail(@RequestBody Map<String, String> payload) {
        String userEmail = payload.get("userEmail");
        String code = payload.get("code");

        if (userEmail == null || userEmail.isEmpty() || code == null || code.isEmpty()) {
            return new ResponseEntity<>(Map.of("verified", false), HttpStatus.BAD_REQUEST);
        }

        if (signupService.verifyEmailCode(userEmail, code)) {
            return new ResponseEntity<>(Map.of("verified", true), HttpStatus.OK);
        } else {
            return new ResponseEntity<>(Map.of("verified", false), HttpStatus.BAD_REQUEST);
        }
    }
}
