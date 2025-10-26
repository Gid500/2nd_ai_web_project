package com.revia.lastdance.signin.dao;

import com.revia.lastdance.signup.vo.UserVO;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

@Mapper
public interface SigninMapper {
    UserVO findUserByEmailOrUserId(@Param("identifier") String identifier);
    UserVO findUserByUserId(@Param("userId") String userId);
    UserVO findUserByEmail(String userEmail);
}
