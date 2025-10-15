package com.revia.lastdance.login.dao;

import com.revia.lastdance.signup.vo.UserVO;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

@Mapper
public interface LoginMapper {
    UserVO findUserByEmailOrUserId(@Param("identifier") String identifier);
    UserVO findUserByUserId(@Param("userId") String userId);
}
