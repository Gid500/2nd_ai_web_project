package com.revia.lastdance.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.web.SecurityFilterChain;

@Configuration
@EnableWebSecurity
public class SecurityConfig {

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
            .csrf(csrf -> csrf.disable()) // CSRF 보호 비활성화 (REST API의 경우 일반적으로 비활성화)
            .authorizeHttpRequests(authorize -> authorize
                .requestMatchers("/login/**", "/signup/**").permitAll() // 로그인 및 회원가입 경로는 인증 없이 허용
                .anyRequest().authenticated() // 그 외 모든 요청은 인증 필요
            );
        return http.build();
    }
}
