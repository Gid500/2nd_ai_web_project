package com.revia.lastdance.user.controller;

import com.revia.lastdance.signin.dto.CustomUserDetails;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/user")
@RequiredArgsConstructor
public class UserController {

    @GetMapping("/me")
    public ResponseEntity<?> getCurrentUser() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || !authentication.isAuthenticated() || authentication.getPrincipal().equals("anonymousUser")) {
            return ResponseEntity.ok(Map.of("loggedIn", false));
        }

        CustomUserDetails userDetails = (CustomUserDetails) authentication.getPrincipal();
        Map<String, Object> userInfo = new HashMap<>();
        userInfo.put("loggedIn", true);
        userInfo.put("email", userDetails.getUsername());
        userInfo.put("userId", userDetails.getUserId());
        userInfo.put("role", userDetails.getAuthorities().stream().findFirst().map(a -> a.getAuthority()).orElse("ROLE_USER"));

        return ResponseEntity.ok(userInfo);
    }
}
