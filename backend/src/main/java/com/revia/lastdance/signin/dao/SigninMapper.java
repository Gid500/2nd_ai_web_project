package com.revia.lastdance.signin.dao;

import com.revia.lastdance.signup.vo.UserVO;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;

@Mapper
public interface SigninMapper {
    UserVO findByUserIdOrEmail(@Param("identifier") String identifier);
    List<UserVO> selectAllUsers();
}