package com.revia.lastdance.signup.controller;

import com.revia.lastdance.signup.service.SignupService;
import com.revia.lastdance.signup.vo.UserVO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api") // 변경: /api/signup -> /api
public class SignupController {

    @Autowired
    private SignupService signupService;

    @PostMapping("/signup/register") // 변경: /register -> /signup/register
    public ResponseEntity<?> registerUser(@RequestBody UserVO userVO) {
        if (signupService.isEmailDuplicated(userVO.getUserEmail())) {
            return ResponseEntity.badRequest().body("이미 사용중인 이메일입니다.");
        }
        if (signupService.isNicknameDuplicated(userVO.getUserNickname())) {
            return ResponseEntity.badRequest().body("이미 사용중인 닉네임입니다.");
        }
        // 사용자 ID 중복 확인 추가
        if (signupService.isUserIdDuplicated(userVO.getUserId())) {
            return ResponseEntity.badRequest().body("이미 사용중인 아이디입니다.");
        }
        signupService.registerUser(userVO);
        return ResponseEntity.ok("회원가입이 완료되었습니다.");
    }

    @GetMapping("/signup/check-email") // 변경: /check-email -> /signup/check-email
    public ResponseEntity<?> checkEmail(@RequestParam String email) {
        boolean isDuplicated = signupService.isEmailDuplicated(email);
        return ResponseEntity.ok(Map.of("isDuplicated", isDuplicated));
    }

    @GetMapping("/signup/check-nickname") // 변경: /check-nickname -> /signup/check-nickname
    public ResponseEntity<?> checkNickname(@RequestParam String nickname) {
        boolean isDuplicated = signupService.isNicknameDuplicated(nickname);
        return ResponseEntity.ok(Map.of("isDuplicated", isDuplicated));
    }

    // 사용자 ID 중복 확인 엔드포인트 추가
    @GetMapping("/signup/check-userid")
    public ResponseEntity<?> checkUserId(@RequestParam String userId) {
        boolean isDuplicated = signupService.isUserIdDuplicated(userId);
        return ResponseEntity.ok(Map.of("isDuplicated", isDuplicated));
    }

    @PostMapping("/signup/send-verification") // 변경: /send-verification -> /signup/send-verification
    public ResponseEntity<?> sendVerificationEmail(@RequestBody Map<String, String> payload) {
        String email = payload.get("email");
        signupService.sendVerificationEmail(email);
        return ResponseEntity.ok("인증 코드가 발송되었습니다.");
    }

    @PostMapping("/signup/verify-code") // 변경: /verify-code -> /signup/verify-code
    public ResponseEntity<?> verifyCode(@RequestBody Map<String, String> payload) {
        String email = payload.get("email");
        String code = payload.get("code");
        boolean isVerified = signupService.verifyEmailCode(email, code);
        if (isVerified) {
            return ResponseEntity.ok(Map.of("isVerified", true));
        }
        return ResponseEntity.badRequest().body(Map.of("isVerified", false));
    }
}
