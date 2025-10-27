package com.revia.lastdance.email.dao;

import com.revia.lastdance.email.vo.EmailVerificationVO;
import org.apache.ibatis.annotations.Mapper;

@Mapper
public interface EmailVerificationMapper {
    void insertEmailVerificationCode(EmailVerificationVO emailVerificationVO);
    EmailVerificationVO getEmailVerificationCode(String userEmail);
    void deleteEmailVerificationCodeByUserEmail(String userEmail);
}
