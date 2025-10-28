package com.revia.lastdance.email.service;

import com.revia.lastdance.email.dao.EmailVerificationMapper;
import com.revia.lastdance.email.vo.EmailVerificationVO;
import lombok.RequiredArgsConstructor;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.Random;

@Service
@RequiredArgsConstructor
public class EmailVerificationService {

    private final JavaMailSender mailSender;
    private final EmailVerificationMapper emailVerificationMapper;

    @Transactional
    public void sendVerificationEmail(String email, String purpose) {
        // 기존 코드 삭제
        emailVerificationMapper.deleteEmailVerificationCodeByUserEmail(email);

        String verificationCode = generateVerificationCode();
        LocalDateTime expiryTime = LocalDateTime.now().plusMinutes(5); // 5분 유효

        EmailVerificationVO emailVerificationVO = new EmailVerificationVO();
        emailVerificationVO.setUserEmail(email);
        emailVerificationVO.setEmailCode(verificationCode);
        emailVerificationVO.setVerifiTime(expiryTime);

        emailVerificationMapper.insertEmailVerificationCode(emailVerificationVO);

        SimpleMailMessage message = new SimpleMailMessage();
        message.setTo(email);
        message.setSubject("[LastDance] " + purpose + " 인증 코드");
        message.setText(purpose + " 인증 코드: " + verificationCode + "\n\n이 코드는 5분간 유효합니다.");
        mailSender.send(message);
    }

    public boolean verifyEmailCode(String email, String code) {
        EmailVerificationVO storedCode = emailVerificationMapper.getEmailVerificationCode(email);

        if (storedCode != null) {
            // 1. 유효 시간 만료 여부 확인
            if (LocalDateTime.now().isAfter(storedCode.getVerifiTime())) {
                // 유효 시간 만료 시 DB에서 코드 삭제
                emailVerificationMapper.deleteEmailVerificationCodeByUserEmail(email);
                return false;
            }

            // 2. 코드 일치 여부 확인 (유효 시간 내에 있는 경우)
            if (storedCode.getEmailCode().equals(code)) {
                emailVerificationMapper.deleteEmailVerificationCodeByUserEmail(email); // 인증 성공 후 코드 삭제
                return true;
            }
        }
        return false;
    }

    private String generateVerificationCode() {
        Random random = new Random();
        int code = 100000 + random.nextInt(900000); // 6자리 숫자 생성
        return String.valueOf(code);
    }
}
