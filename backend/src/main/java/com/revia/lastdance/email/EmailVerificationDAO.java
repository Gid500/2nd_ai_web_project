package com.revia.lastdance.email;

import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

@Mapper
public interface EmailVerificationDAO {
    void saveVerificationCode(EmailVerificationVO emailVerificationVO);
    EmailVerificationVO findVerificationCode(@Param("userEmail") String userEmail, @Param("emailCode") String emailCode);
    void deleteVerificationCode(@Param("userEmail") String userEmail);
}
