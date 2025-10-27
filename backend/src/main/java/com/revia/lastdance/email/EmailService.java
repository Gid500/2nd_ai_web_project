package com.revia.lastdance.email;

import org.springframework.stereotype.Service;
import lombok.extern.slf4j.Slf4j;

@Service
@Slf4j
public class EmailService {

    public void sendVerificationEmail(String to, String code) {
        log.info("Sending verification email to {} with code: {}", to, code);
        // 실제 이메일 전송 로직 (예: JavaMailSender 사용)은 여기에 구현됩니다.
        // 현재는 로그로 대체합니다.
    }
}
