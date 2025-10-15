package com.revia.lastdance.signup.vo;

import lombok.Data;
import java.sql.Timestamp;

@Data
public class UserVO {
    private String userId;
    private String userName;
    private String userNickname;
    private String userEmail;
    private String userPwd;
    private byte[] userImgUrl;
    private Integer roleId;
    private String roleType;
    private Timestamp createdDate;
    private String createdId;
    private Timestamp updatedDate;
    private String updatedId;
}
