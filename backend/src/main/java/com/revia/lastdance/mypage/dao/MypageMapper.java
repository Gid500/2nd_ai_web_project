package com.revia.lastdance.mypage.dao;

import com.revia.lastdance.signup.vo.EmailVerificationVO;
import com.revia.lastdance.signup.vo.UserVO;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;
import org.springframework.stereotype.Repository;

@Mapper
@Repository
public interface MypageMapper {
    void updateUserNickname(UserVO userVO);
    int checkNicknameAvailability(@Param("userNickname") String userNickname, @Param("userId") String userId);
    void insertEmailVerification(EmailVerificationVO emailVerificationVO);
    EmailVerificationVO selectEmailVerification(EmailVerificationVO emailVerificationVO);
    void deleteEmailVerification(EmailVerificationVO emailVerificationVO);
    void updateUserPassword(UserVO userVO);
    void updateUserImgUrl(UserVO userVO);
    void deleteAccount(String userId);
    UserVO getUserById(String userId);
}
