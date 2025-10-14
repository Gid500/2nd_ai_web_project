package com.revia.lastdance.login.controller;

import com.revia.lastdance.login.vo.LoginReqVO;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpSession;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.authentication.AnonymousAuthenticationToken; // AnonymousAuthenticationToken import 추가
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.GetMapping;
import java.util.Map; // Map import 추가

@RestController
@RequestMapping("/api")
public class LoginController {

    @Autowired
    private AuthenticationManager authenticationManager;

    @PostMapping("/login")
    public ResponseEntity<Map<String, String>> login(@RequestBody LoginReqVO loginReqVO, HttpServletRequest request) {
        try {
            Authentication authentication = authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(loginReqVO.getIdentifier(), loginReqVO.getUserPwd())
            );
            SecurityContextHolder.getContext().setAuthentication(authentication);

            // 세션에 사용자 ID 저장 (Spring Security가 세션을 관리하므로 직접 저장할 필요는 없지만, 기존 로직 유지를 위해 추가)
            HttpSession session = request.getSession(true); // 세션이 없으면 새로 생성
            session.setAttribute("loggedInUser", authentication.getName()); // 인증된 사용자 ID 저장
            session.setMaxInactiveInterval(30 * 60); // 세션 만료 시간 30분

            return ResponseEntity.ok().body(Map.of("userId", authentication.getName()));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of("error", "이메일 또는 비밀번호가 일치하지 않습니다."));
        }
    }

    @PostMapping("/logout")
    public ResponseEntity<?> logout(HttpServletRequest request) {
        HttpSession session = request.getSession(false); // 기존 세션이 없으면 생성하지 않음
        if (session != null) {
            session.invalidate(); // 세션 무효화
        }
        SecurityContextHolder.clearContext(); // SecurityContextHolder 초기화
        return ResponseEntity.ok().body("로그아웃 성공");
    }

    @GetMapping("/checkSession")
    public ResponseEntity<?> checkSession(HttpServletRequest request) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication != null && authentication.isAuthenticated() && !(authentication instanceof AnonymousAuthenticationToken)) {
            return ResponseEntity.ok().body("세션 유효: " + authentication.getName());
        } else {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("세션 유효하지 않음");
        }
    }
}
