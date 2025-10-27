package com.revia.lastdance.email;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.sql.Timestamp;
import java.time.LocalDateTime;
import java.util.Random;

@Service
public class EmailVerificationService {

    @Autowired
    private EmailVerificationDAO emailVerificationDAO;

    @Autowired
    private EmailService emailService;

    private static final int VERIFICATION_CODE_LENGTH = 6;
    private static final long VERIFICATION_CODE_EXPIRATION_MINUTES = 5;

    public String generateVerificationCode() {
        Random random = new Random();
        StringBuilder code = new StringBuilder();
        for (int i = 0; i < VERIFICATION_CODE_LENGTH; i++) {
            code.append(random.nextInt(10));
        }
        return code.toString();
    }

    public void sendAndSaveVerificationCode(String userEmail) {
        String code = generateVerificationCode();
        EmailVerificationVO emailVerificationVO = new EmailVerificationVO();
        emailVerificationVO.setUserEmail(userEmail);
        emailVerificationVO.setEmailCode(code);
        emailVerificationVO.setVerifiTime(Timestamp.valueOf(LocalDateTime.now()));

        // 기존 인증 코드 삭제 후 저장
        emailVerificationDAO.deleteVerificationCode(userEmail);
        emailVerificationDAO.saveVerificationCode(emailVerificationVO);

        emailService.sendVerificationEmail(userEmail, code);
    }

    public boolean verifyCode(String userEmail, String code) {
        EmailVerificationVO storedCode = emailVerificationDAO.findVerificationCode(userEmail, code);

        if (storedCode == null) {
            return false; // 코드가 없거나 일치하지 않음
        }

        LocalDateTime expirationTime = storedCode.getVerifiTime().toLocalDateTime().plusMinutes(VERIFICATION_CODE_EXPIRATION_MINUTES);
        if (LocalDateTime.now().isAfter(expirationTime)) {
            emailVerificationDAO.deleteVerificationCode(userEmail); // 만료된 코드 삭제
            return false; // 코드 만료
        }

        emailVerificationDAO.deleteVerificationCode(userEmail); // 인증 성공 후 코드 삭제
        return true;
    }
}
