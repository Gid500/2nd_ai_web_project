package com.revia.lastdance.signup.vo;

import lombok.Data;
import java.sql.Timestamp;

@Data
public class UserVO {
    private String userId;
    private String userNickname;
    private String userEmail;
    private String userPwd;
    private byte[] userImgUrl; // BLOB 타입은 byte 배열로 매핑
    private Integer isAdmin; // TINYINT는 Integer로 매핑
    private Timestamp createdDate;
    private String createdId;
    private Timestamp updatedDate;
    private String updatedId;
}
