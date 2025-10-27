package com.revia.lastdance.signup.controller;

import com.revia.lastdance.config.jwt.JwtUtil;
import com.revia.lastdance.signin.dto.AuthenticationResponse;
import com.revia.lastdance.signup.service.SignupService;
import com.revia.lastdance.signup.vo.UserVO;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.web.bind.annotation.*;

import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletResponse;
import java.util.Map;

@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
public class SignupController {

    private static final Logger logger = LoggerFactory.getLogger(SignupController.class);

    private final SignupService signupService;
    private final JwtUtil jwtUtil;
    private final UserDetailsService userDetailsService;

    @PostMapping("/signup/register")
    public ResponseEntity<?> registerUser(@RequestBody UserVO userVO, HttpServletResponse response) {
        logger.info("Received signup request for user: {}", userVO.toString());

        if (signupService.isEmailDuplicated(userVO.getUserEmail())) {
            return ResponseEntity.badRequest().body("이미 사용중인 이메일입니다.");
        }
        if (signupService.isNicknameDuplicated(userVO.getUserNickname())) {
            return ResponseEntity.badRequest().body("이미 사용중인 닉네임입니다.");
        }
        if (signupService.isUserIdDuplicated(userVO.getUserId())) {
            return ResponseEntity.badRequest().body("이미 사용중인 아이디입니다.");
        }
        signupService.registerUser(userVO);

        final UserDetails userDetails = userDetailsService.loadUserByUsername(userVO.getUserEmail());
        final String jwt = jwtUtil.generateToken(userDetails);

        // Set JWT in an HttpOnly cookie
        Cookie jwtCookie = new Cookie("jwt", jwt);
        jwtCookie.setHttpOnly(true);
        jwtCookie.setPath("/"); // Accessible throughout the application
        jwtCookie.setMaxAge(60 * 60 * 10); // 10 hours
        // jwtCookie.setSecure(true); // Only send over HTTPS
        response.addCookie(jwtCookie);

        // Optionally, return some user info in the body if needed by frontend JS
        return ResponseEntity.ok(new AuthenticationResponse(jwt)); // Still returning JWT in body for frontend compatibility for now
    }

    @GetMapping("/signup/check-email")
    public ResponseEntity<?> checkEmail(@RequestParam String email) {
        boolean isDuplicated = signupService.isEmailDuplicated(email);
        return ResponseEntity.ok(Map.of("isDuplicated", isDuplicated));
    }

    @GetMapping("/signup/check-nickname")
    public ResponseEntity<?> checkNickname(@RequestParam String nickname) {
        boolean isDuplicated = signupService.isNicknameDuplicated(nickname);
        return ResponseEntity.ok(Map.of("isDuplicated", isDuplicated));
    }

    @GetMapping("/signup/check-userid")
    public ResponseEntity<?> checkUserId(@RequestParam String userId) {
        boolean isDuplicated = signupService.isUserIdDuplicated(userId);
        return ResponseEntity.ok(Map.of("isDuplicated", isDuplicated));
    }
}
