package com.revia.lastdance.email.controller;

import com.revia.lastdance.email.service.EmailVerificationService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/email")
@RequiredArgsConstructor
public class EmailVerificationController {

    private final EmailVerificationService emailVerificationService;

    @PostMapping("/send-verification")
    public ResponseEntity<?> sendVerificationEmail(@RequestBody Map<String, String> payload) {
        String email = payload.get("email");
        String purpose = payload.getOrDefault("purpose", "이메일"); // Default to "이메일" if not provided
        emailVerificationService.sendVerificationEmail(email, purpose);
        return ResponseEntity.ok("인증 코드가 발송되었습니다.");
    }

    @PostMapping("/verify-code")
    public ResponseEntity<?> verifyCode(@RequestBody Map<String, String> payload) {
        String email = payload.get("email");
        String code = payload.get("code");
        boolean isVerified = emailVerificationService.verifyEmailCode(email, code);
        if (isVerified) {
            return ResponseEntity.ok(Map.of("isVerified", true));
        }
        return ResponseEntity.badRequest().body(Map.of("isVerified", false));
    }
}
