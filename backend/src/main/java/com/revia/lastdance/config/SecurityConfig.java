package com.revia.lastdance.config;

import com.revia.lastdance.config.jwt.JwtAuthenticationFilter;
import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.AuthenticationProvider;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.Arrays;

@Configuration
@EnableWebSecurity
@EnableMethodSecurity
@RequiredArgsConstructor
public class SecurityConfig {

    private final JwtAuthenticationFilter jwtAuthenticationFilter;
    private final UserDetailsService userDetailsService;

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder(12);
    }

    @Bean
    public AuthenticationProvider authenticationProvider() {
        DaoAuthenticationProvider authProvider = new DaoAuthenticationProvider();
        authProvider.setUserDetailsService(userDetailsService);
        authProvider.setPasswordEncoder(passwordEncoder());
        return authProvider;
    }

    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration authenticationConfiguration) throws Exception {
        return authenticationConfiguration.getAuthenticationManager();
    }

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
                .cors(cors -> cors.configurationSource(corsConfigurationSource()))
                .csrf(csrf -> csrf.disable())
                .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                .authorizeHttpRequests(authorize -> authorize
                        .requestMatchers("/api/signup/**", "/api/signin", "/api/flask/**").permitAll()
                        .requestMatchers(HttpMethod.GET, "/api/posts/**").permitAll()
                        .requestMatchers(HttpMethod.GET, "/api/comments/post/**").permitAll() // 댓글 목록 조회 허용
                        .requestMatchers(HttpMethod.POST, "/api/comments/delete/**").authenticated() // 댓글 삭제는 인증된 사용자만 (세부 권한은 서비스 계층에서 확인)
                        .requestMatchers(HttpMethod.POST, "/api/comments/**").authenticated() // 댓글 작성, 수정은 인증된 사용자만
                        .requestMatchers(HttpMethod.POST, "/api/posts/delete/**").authenticated() // 게시물 삭제는 인증된 사용자만
                        // 관리자용 사용자 조회 및 삭제 엔드포인트
                        .requestMatchers(HttpMethod.GET, "/api/user/all").hasRole("admin")
                        .requestMatchers(HttpMethod.GET, "/api/comments/admin/all").hasRole("admin") // 관리자용 모든 댓글 조회
                        .requestMatchers(HttpMethod.DELETE, "/api/user/**").authenticated() // 회원 탈퇴는 인증된 사용자만
                        .requestMatchers(HttpMethod.POST, "/api/email/send-verification", "/api/email/verify-code").permitAll() // 이메일 인증은 모두 허용
                        // 신고 관련 엔드포인트 권한 설정
                        .requestMatchers(HttpMethod.GET, "/api/report").hasRole("admin") // 모든 신고 조회는 admin만 가능
                        .requestMatchers(HttpMethod.GET, "/api/report/types").hasRole("admin") // 신고 타입 조회는 admin만 가능
                        .requestMatchers(HttpMethod.GET, "/api/report/{reportId}").hasRole("admin") // 특정 신고 조회는 admin만 가능
                        .requestMatchers(HttpMethod.POST, "/api/report").authenticated() // 신고 생성은 인증된 사용자만
                        .requestMatchers(HttpMethod.POST, "/api/report/update").hasRole("admin") // 신고 업데이트는 admin만 가능
                        .requestMatchers(HttpMethod.POST, "/api/report/delete/{reportId}").hasRole("admin") // 신고 삭제는 admin만 가능
                        .anyRequest().authenticated()
                )
                .authenticationProvider(authenticationProvider())
                .addFilterBefore(jwtAuthenticationFilter, UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();
        configuration.setAllowedOrigins(Arrays.asList("http://localhost:3000"));
        configuration.setAllowedMethods(Arrays.asList("GET", "POST", "PUT", "DELETE", "OPTIONS"));
        configuration.setAllowedHeaders(Arrays.asList("*"));
        configuration.setAllowCredentials(true);
        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);
        return source;
    }
}
