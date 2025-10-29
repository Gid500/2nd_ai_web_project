package com.revia.lastdance.signup.service;

import com.revia.lastdance.email.service.EmailVerificationService;
import com.revia.lastdance.signup.dao.SignupMapper;
import com.revia.lastdance.signup.vo.UserVO;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.sql.Timestamp;

@Service
@RequiredArgsConstructor
public class SignupService {

    private final SignupMapper signupMapper;
    private final PasswordEncoder passwordEncoder;
    private final EmailVerificationService emailVerificationService;

    // 회원가입 처리
    @Transactional
    public void registerUser(UserVO userVO) {

        // 비밀번호 암호화
        String encodedPassword = passwordEncoder.encode(userVO.getUserPwd());
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
    public void sendVerificationEmail(String userEmail) {
        emailVerificationService.sendVerificationEmail(userEmail, "회원가입");
    }

    // 이메일 인증 코드 확인
    public boolean verifyEmailCode(String userEmail, String code) {
        return emailVerificationService.verifyEmailCode(userEmail, code);
    }
}
