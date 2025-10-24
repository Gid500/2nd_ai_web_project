package com.revia.lastdance.signin.controller;

import com.revia.lastdance.signin.service.SigninService;
import com.revia.lastdance.signin.vo.SigninReqVO;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.GetMapping;

import jakarta.servlet.http.HttpSession;

@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
public class SigninController {

    private final SigninService signinService;

    @PostMapping("/login")
    public ResponseEntity<String> login(@RequestBody SigninReqVO signinReqVO, HttpSession session) {
        boolean isAuthenticated = signinService.login(signinReqVO.getIdentifier(), signinReqVO.getUserPwd(), session);
        if (isAuthenticated) {
            session.setAttribute("loggedInUser", signinReqVO.getIdentifier()); // Set session attribute on successful login
            return ResponseEntity.ok("Login successful");
        } else {
            return ResponseEntity.status(401).body("Invalid credentials");
        }
    }

    @PostMapping("/logout")
    public ResponseEntity<String> logout(HttpSession session) {
        session.invalidate(); // Invalidate the current session
        return ResponseEntity.ok("Logout successful");
    }

    @GetMapping("/session-status")
    public ResponseEntity<?> getSessionStatus(HttpSession session) {
        // Check if the session is new or if a specific attribute exists to determine login status
        boolean loggedIn = session.getAttribute("loggedInUser") != null; // Assuming "loggedInUser" is set upon successful login
        return ResponseEntity.ok(java.util.Map.of("loggedIn", loggedIn));
    }
}