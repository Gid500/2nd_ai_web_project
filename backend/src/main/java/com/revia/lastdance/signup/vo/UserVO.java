package com.revia.lastdance.signup.vo;

import lombok.Data;
import java.sql.Timestamp;

@Data
public class UserVO {
    private String userId;

    private String userNickname;
    private String userEmail;
    private String userPwd;
    private String userImgUrl;
    private String roleType;
    private int roleId;

    private Timestamp createdDate;
    private String createdId;
    private Timestamp updatedDate;
    private String updatedId;
}
