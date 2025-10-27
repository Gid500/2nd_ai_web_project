package com.revia.lastdance.withdrawal.dao;

import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

@Mapper
public interface WithdrawalDAO {
    int deleteUser(@Param("userId") String userId);
}
