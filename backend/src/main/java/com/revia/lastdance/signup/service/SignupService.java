package com.revia.lastdance.signup.service;

import com.revia.lastdance.config.EmailSendingException;
import com.revia.lastdance.config.EmailVerificationProperties;
import com.revia.lastdance.signup.dao.SignupMapper;
import com.revia.lastdance.signup.vo.EmailVerificationVO;
import com.revia.lastdance.signup.vo.UserVO;
import jakarta.mail.internet.MimeMessage;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.sql.Timestamp;
import java.util.Calendar;
import java.util.Random;

@Service
public class SignupService {

    @Autowired
    private SignupMapper signupMapper;

    @Autowired
    private JavaMailSender mailSender;

    @Autowired
    private EmailVerificationProperties emailVerificationProperties;

    @Autowired
    private BCryptPasswordEncoder bCryptPasswordEncoder;

    // 회원가입 처리
    @Transactional
    public void registerUser(UserVO userVO) {
        
        // 비밀번호 암호화
        String encodedPassword = bCryptPasswordEncoder.encode(userVO.getUserPwd());
        userVO.setUserPwd(encodedPassword);
        
        // 사용자 ID는 userVO에 이미 설정되어 있다고 가정하고 UUID 생성 로직 제거
        String userId = userVO.getUserId();
        userVO.setCreatedId(userId);
        userVO.setUpdatedId(userId);
        userVO.setCreatedDate(new Timestamp(System.currentTimeMillis()));
        userVO.setUpdatedDate(new Timestamp(System.currentTimeMillis()));
        userVO.setRoleId(1); // Default role for new users
        
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

    // 사용자 ID 중복 확인
    public boolean isUserIdDuplicated(String userId) {
        return signupMapper.countByUserId(userId) > 0;
    }

    // 이메일 인증 코드 생성 및 전송
    @Transactional
    public String sendVerificationEmail(String userEmail) {
        String verificationCode = generateVerificationCode();

        // 기존 인증 코드 삭제
        signupMapper.deleteEmailVerificationCodeByUserEmail(userEmail);

        // 인증 코드 및 만료 시간 저장
        EmailVerificationVO emailVerificationVO = new EmailVerificationVO();
        emailVerificationVO.setUserEmail(userEmail);
        emailVerificationVO.setEmailCode(verificationCode);

        Calendar calendar = Calendar.getInstance();
        calendar.setTimeInMillis(System.currentTimeMillis());
        calendar.add(Calendar.MILLISECOND, (int) emailVerificationProperties.getExpiration());
        emailVerificationVO.setVerifiTime(new Timestamp(calendar.getTimeInMillis()));

        signupMapper.insertEmailVerificationCode(emailVerificationVO);

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
        EmailVerificationVO storedCode = signupMapper.getEmailVerificationCode(userEmail);

        if (storedCode != null) {
            if (storedCode.getEmailCode().equals(code)) {
                if (storedCode.getVerifiTime().getTime() > System.currentTimeMillis()) {
                    signupMapper.deleteEmailVerificationCodeByUserEmail(userEmail);
                    return true;
                }
            }
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
