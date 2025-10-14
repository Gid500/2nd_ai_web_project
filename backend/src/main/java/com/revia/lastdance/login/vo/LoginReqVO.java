package com.revia.lastdance.login.vo;

import lombok.Data;

@Data
public class LoginReqVO {
    private String identifier; // userEmail 대신 identifier 사용
    private String userPwd;
}
