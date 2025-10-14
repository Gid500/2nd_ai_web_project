package com.revia.lastdance.login.dao;

import com.revia.lastdance.signup.vo.UserVO;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

@Mapper
public interface LoginMapper {
    // 이메일로 사용자 정보 조회
    UserVO findUserByEmail(String userEmail);

    // 이메일 또는 아이디로 사용자 정보 조회
    UserVO findUserByEmailOrUserId(@Param("identifier") String identifier);
}
