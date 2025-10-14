package com.revia.lastdance.login.controller;

import com.revia.lastdance.login.service.LoginService;
import com.revia.lastdance.login.vo.LoginReqVO;
import com.revia.lastdance.signup.vo.UserVO;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpSession;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api")
public class LoginController {

    @Autowired
    private LoginService loginService;

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginReqVO loginReqVO, HttpServletRequest request) {
        UserVO user = loginService.login(loginReqVO.getIdentifier(), loginReqVO.getUserPwd());

        if (user != null) {
            HttpSession session = request.getSession();
            session.setAttribute("loggedInUser", user.getUserId()); // 세션에 사용자 ID 저장
            session.setMaxInactiveInterval(30 * 60); // 세션 만료 시간 30분
            return ResponseEntity.ok().body("로그인 성공");
        }

        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("이메일 또는 비밀번호가 일치하지 않습니다.");
    }

    @PostMapping("/logout")
    public ResponseEntity<?> logout(HttpServletRequest request) {
        HttpSession session = request.getSession(false); // 기존 세션이 없으면 생성하지 않음
        if (session != null) {
            session.invalidate(); // 세션 무효화
        }
        return ResponseEntity.ok().body("로그아웃 성공");
    }

    @GetMapping("/checkSession")
    public ResponseEntity<?> checkSession(HttpServletRequest request) {
        HttpSession session = request.getSession(false);
        if (session != null && session.getAttribute("loggedInUser") != null) {
            return ResponseEntity.ok().body("세션 유효: " + session.getAttribute("loggedInUser"));
        } else {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("세션 유효하지 않음");
        }
    }
}
