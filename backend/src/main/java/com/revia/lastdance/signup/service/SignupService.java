package com.revia.lastdance.signup.service;

import org.springframework.transaction.annotation.Isolation;
import org.springframework.transaction.annotation.Transactional;

import com.revia.lastdance.config.EmailSendingException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import com.revia.lastdance.config.EmailVerificationProperties;
import com.revia.lastdance.signup.dao.SignupMapper;
import com.revia.lastdance.signup.vo.EmailVerificationVO;
import com.revia.lastdance.signup.vo.UserVO;
import jakarta.mail.internet.MimeMessage;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.sql.Timestamp;
import java.util.Calendar;
import java.util.Random;

@Service
public class SignupService {

    @Autowired
    private SignupMapper signupMapper;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private JavaMailSender mailSender;

    @Autowired
    private EmailVerificationProperties emailVerificationProperties;

    // 회원가입 처리
    public void registerUser(UserVO userVO) {
        // 비밀번호 암호화
        userVO.setUserPwd(passwordEncoder.encode(userVO.getUserPwd()));
        // 사용자 ID는 UUID 등으로 생성하는 것이 좋지만, 여기서는 예시로 userEmail을 사용
        userVO.setUserId(userVO.getUserEmail()); // 실제 구현에서는 UUID.randomUUID().toString() 등을 사용
        userVO.setCreatedId(userVO.getUserId());
        userVO.setUpdatedId(userVO.getUserId());
        signupMapper.insertUser(userVO);
    }

    // 이메일 중복 확인
    public boolean isEmailDuplicated(String userEmail) {
        return signupMapper.countByUserEmail(userEmail) > 0;
    }

    // 닉네임 중복 확인
    public boolean isNicknameDuplicated(String userNickname) {
        return signupMapper.countByUserNickname(userNickname) > 0;
    }

    private static final Logger logger = LoggerFactory.getLogger(SignupService.class);

    // 이메일 인증 코드 생성 및 전송
    @Transactional(isolation = Isolation.READ_UNCOMMITTED) // 이 어노테이션 추가
    public String sendVerificationEmail(String userEmail) {
        String verificationCode = generateVerificationCode();
        // String userId = userEmail.toLowerCase(); // userId 대신 userEmail 사용

        // 기존 인증 코드 삭제
        signupMapper.deleteEmailVerificationCodeByUserEmail(userEmail); // 메서드 이름 변경 및 userEmail 전달

        // 인증 코드 및 만료 시간 저장
        EmailVerificationVO emailVerificationVO = new EmailVerificationVO();
        emailVerificationVO.setUserEmail(userEmail); // userId 대신 userEmail 사용
        emailVerificationVO.setEmailCode(verificationCode);

        Calendar calendar = Calendar.getInstance();
        calendar.setTimeInMillis(System.currentTimeMillis());
        calendar.add(Calendar.MILLISECOND, (int) emailVerificationProperties.getExpiration());
        emailVerificationVO.setVerifiTime(new Timestamp(calendar.getTimeInMillis()));

        logger.info("Preparing to insert verification code for userEmail: {}, code: {}", emailVerificationVO.getUserEmail(), emailVerificationVO.getEmailCode());
        signupMapper.insertEmailVerificationCode(emailVerificationVO);

        // --- 추가할 로그 및 DB 확인 로직 ---
        logger.info("Attempted to insert verification code for userEmail: {}", userEmail);
        logger.info("Attempting to retrieve inserted code for userEmail: {}", userEmail);
        EmailVerificationVO insertedCodeCheck = signupMapper.getEmailVerificationCode(userEmail);
        if (insertedCodeCheck != null) {
            logger.info("Successfully retrieved inserted code immediately after insert: {}", insertedCodeCheck);
        } else {
            logger.error("Failed to retrieve inserted code immediately after insert for userEmail: {}", userEmail);
        }
        // --- 여기까지 추가 ---

        // 이메일 전송
        try {
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");
            helper.setTo(userEmail);
            helper.setSubject("[LastDance] 이메일 인증 코드입니다.");
            helper.setText("인증 코드: " + verificationCode, true);
            mailSender.send(message);
        } catch (Exception e) {
            e.printStackTrace();
            throw new EmailSendingException("Failed to send verification email", e);
        }
        return verificationCode;
    }

    // 이메일 인증 코드 확인
    public boolean verifyEmailCode(String userEmail, String code) {
        logger.info("Verifying email code for userEmail: {}, input code: {}", userEmail, code);
        // String userId = userEmail.toLowerCase(); // userId 대신 userEmail 사용
        logger.info("Using userEmail: {}", userEmail); // 로그 변경

        // user_email만으로 인증 코드 조회
        EmailVerificationVO storedCode = signupMapper.getEmailVerificationCode(userEmail); // userEmail 전달

        if (storedCode != null) {
            logger.info("Stored code found: {}", storedCode);
            // 사용자가 입력한 코드와 DB에 저장된 코드 비교
            if (!storedCode.getEmailCode().equals(code)) {
                logger.warn("Input code does not match stored code. Input: {}, Stored: {}", code, storedCode.getEmailCode());
                signupMapper.deleteEmailVerificationCodeByUserEmail(userEmail); // 메서드 이름 변경 및 userEmail 전달
                return false;
            }

            // 만료 시간 확인
            if (storedCode.getVerifiTime().getTime() > System.currentTimeMillis()) {
                logger.info("Verification code is valid and not expired.");
                signupMapper.deleteEmailVerificationCodeByUserEmail(userEmail); // 메서드 이름 변경 및 userEmail 전달
                return true;
            } else {
                logger.warn("Verification code for userEmail {} is expired. Stored time: {}", userEmail, storedCode.getVerifiTime()); // 로그 변경
                signupMapper.deleteEmailVerificationCodeByUserEmail(userEmail); // 메서드 이름 변경 및 userEmail 전달
            }
        }
        else {
            logger.warn("No stored verification code found for userEmail {}.", userEmail); // 로그 변경
        }
        return false;
    }

    // 6자리 인증 코드 생성
    private String generateVerificationCode() {
        Random random = new Random();
        int code = 100000 + random.nextInt(900000); // 6자리 숫자
        return String.valueOf(code);
    }
}
