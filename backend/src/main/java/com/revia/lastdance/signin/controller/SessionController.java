package com.revia.lastdance.signin.controller;

import com.revia.lastdance.signin.dao.SigninMapper;
import com.revia.lastdance.signup.vo.UserVO;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.servlet.http.HttpSession;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.HashMap;
import java.util.Map;

@Slf4j
@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
public class SessionController {

    private final SigninMapper signinMapper;

    @GetMapping("/checkSession")
    public ResponseEntity<?> checkSession(HttpSession session, HttpServletResponse response) {
        log.info("Checking session. Session ID: {}", session.getId());
        String userId = (String) session.getAttribute("userId");
        if (userId != null) {
            log.info("Session valid for user: {}", userId);
            UserVO user = signinMapper.findUserByUserId(userId); // Assuming you have a method to find user by userId
            if (user != null) {
                Map<String, Object> responseBody = new HashMap<>();
                responseBody.put("isAuthenticated", true);
                responseBody.put("user", user);
                responseBody.put("roleType", user.getRoleType()); // Add roleType to response body
                return ResponseEntity.ok(responseBody);
            }
        }
        log.info("Session invalid or no user found. Returning 401 Unauthorized.");
        Map<String, Object> responseBody = new HashMap<>();
        responseBody.put("isAuthenticated", false);
        return ResponseEntity.status(401).body(responseBody);
    }

    @PostMapping("/session-logout")
    public ResponseEntity<String> logout(HttpSession session, HttpServletResponse response) {
        log.info("Attempting to logout. Session ID before invalidate: {}", session.getId());
        session.invalidate(); // Invalidate the current session

        // Explicitly delete the JSESSIONID cookie
        Cookie cookie = new Cookie("JSESSIONID", null);
        cookie.setMaxAge(0); // Expire the cookie immediately
        cookie.setPath("/"); // Set the path to the root context
        cookie.setHttpOnly(true); // Important for security
        response.addCookie(cookie);

        log.info("Session invalidated and JSESSIONID cookie deleted.");
        return ResponseEntity.ok("Logout successful");
    }
}
