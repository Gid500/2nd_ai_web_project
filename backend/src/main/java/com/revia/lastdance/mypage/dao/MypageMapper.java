package com.revia.lastdance.mypage.dao;

import com.revia.lastdance.signup.vo.EmailVerificationVO;
import com.revia.lastdance.signup.vo.UserVO;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

@Mapper
public interface MypageMapper {

    void updateUserNickname(UserVO userVO);

    void insertEmailVerification(EmailVerificationVO emailVerificationVO);
    EmailVerificationVO selectEmailVerification(EmailVerificationVO emailVerificationVO);
    void updateUserPassword(UserVO userVO);
    void deleteEmailVerification(EmailVerificationVO emailVerificationVO);
    void updateUserImgUrl(UserVO userVO);
    int checkNicknameAvailability(@Param("userNickname") String userNickname, @Param("userId") String userId);

}
