package com.revia.lastdance.signin.vo;

import lombok.Data;

@Data
public class SigninReqVO {
    private String identifier; // userEmail 대신 identifier 사용
    private String userPwd;
}
