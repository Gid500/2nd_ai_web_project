package com.revia.lastdance.email;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController
@RequestMapping("/api/email")
public class EmailVerificationController {

    @Autowired
    private EmailVerificationService emailVerificationService;

    @PostMapping("/send-verification")
    public ResponseEntity<String> sendVerificationEmail(@RequestBody Map<String, String> payload) {
        String userEmail = payload.get("userEmail");
        if (userEmail == null || userEmail.isEmpty()) {
            return new ResponseEntity<>("Email is required", HttpStatus.BAD_REQUEST);
        }
        try {
            emailVerificationService.sendAndSaveVerificationCode(userEmail);
            return new ResponseEntity<>("Verification email sent", HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>("Failed to send verification email", HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @PostMapping("/verify-code")
    public ResponseEntity<String> verifyCode(@RequestBody Map<String, String> payload) {
        String userEmail = payload.get("userEmail");
        String code = payload.get("code");

        if (userEmail == null || userEmail.isEmpty() || code == null || code.isEmpty()) {
            return new ResponseEntity<>("Email and code are required", HttpStatus.BAD_REQUEST);
        }

        boolean verified = emailVerificationService.verifyCode(userEmail, code);
        if (verified) {
            return new ResponseEntity<>("Email verified successfully", HttpStatus.OK);
        } else {
            return new ResponseEntity<>("Invalid or expired verification code", HttpStatus.UNAUTHORIZED);
        }
    }
}
