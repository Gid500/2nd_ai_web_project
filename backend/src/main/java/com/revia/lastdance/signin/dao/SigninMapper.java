package com.revia.lastdance.signin.dao;

import com.revia.lastdance.signup.vo.UserVO;
import com.revia.lastdance.user.vo.AdminUserVO;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;

@Mapper
public interface SigninMapper {
    UserVO findByUserIdOrEmail(@Param("identifier") String identifier);
    List<UserVO> selectAllUsers();
    List<AdminUserVO> selectAllAdminUsers();
    int getReportCountByUserId(@Param("userId") String userId);
}