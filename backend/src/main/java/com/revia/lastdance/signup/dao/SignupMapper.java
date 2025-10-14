package com.revia.lastdance.signup.dao;

import com.revia.lastdance.signup.vo.EmailVerificationVO;
import com.revia.lastdance.signup.vo.UserVO;
import org.apache.ibatis.annotations.Mapper;

@Mapper
public interface SignupMapper {
    // 사용자 등록
    void insertUser(UserVO userVO);

    // 이메일 중복 확인
    int countByUserEmail(String userEmail);

    // 닉네임 중복 확인
    int countByUserNickname(String userNickname);

    // 이메일 인증 코드 저장
    void insertEmailVerificationCode(EmailVerificationVO emailVerificationVO);

    // 이메일 인증 코드 조회
    EmailVerificationVO getEmailVerificationCode(String userEmail);

    // 이메일 인증 코드 삭제 (user_email만으로)
    void deleteEmailVerificationCodeByUserEmail(String userEmail);
}
