package com.revia.lastdance.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.lang.NonNull;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

/**
 * 웹 관련 설정을 담당하는 구성 클래스입니다.
 * CORS(Cross-Origin Resource Sharing) 설정을 추가하고, BCryptPasswordEncoder 빈을 등록합니다.
 */
@Configuration
public class WebConfig implements WebMvcConfigurer {

    /**
     * 비밀번호 암호화를 위한 BCryptPasswordEncoder 빈을 등록합니다.
     * @return BCryptPasswordEncoder 인스턴스
     */
    @Bean
    public BCryptPasswordEncoder bCryptPasswordEncoder() {
        return new BCryptPasswordEncoder();
    }

    /**
     * CORS 설정을 추가합니다.
     * 프론트엔드 애플리케이션(http://localhost:3000)에서의 요청을 허용합니다.
     * @param registry CORS 설정을 위한 CorsRegistry
     */
    @Override
    public void addCorsMappings(@NonNull CorsRegistry registry) {
        registry.addMapping("/**") // 모든 경로에 대해
                .allowedOrigins("http://localhost:3000", "http://127.0.0.1:3000") // http://localhost:3000 및 http://127.0.0.1:3000 에서 오는 요청 허용
                .allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS") // 허용할 HTTP 메서드 지정
                .allowedHeaders("Authorization", "Content-Type") // Authorization 헤더와 Content-Type 헤더 허용
                .allowCredentials(true); // 자격 증명(쿠키, HTTP 인증 및 클라이언트 SSL 인증서) 허용
    }
}