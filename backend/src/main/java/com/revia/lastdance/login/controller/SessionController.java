package com.revia.lastdance.login.controller;

import com.revia.lastdance.signup.vo.UserVO;
import com.revia.lastdance.login.dao.LoginMapper;
import jakarta.servlet.http.HttpSession;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
public class SessionController {

    private final LoginMapper loginMapper;

    @GetMapping("/checkSession")
    public ResponseEntity<?> checkSession(HttpSession session) {
        String userId = (String) session.getAttribute("userId");
        if (userId != null) {
            UserVO user = loginMapper.findUserByUserId(userId); // Assuming you have a method to find user by userId
            if (user != null) {
                Map<String, Object> response = new HashMap<>();
                response.put("isAuthenticated", true);
                response.put("user", user);
                return ResponseEntity.ok(response);
            }
        }
        Map<String, Object> response = new HashMap<>();
        response.put("isAuthenticated", false);
        return ResponseEntity.ok(response);
    }

    @PostMapping("/logout")
    public ResponseEntity<String> logout(HttpSession session) {
        session.invalidate(); // Invalidate the current session
        return ResponseEntity.ok("Logout successful");
    }
}
