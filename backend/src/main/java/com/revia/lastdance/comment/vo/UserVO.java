package com.revia.lastdance.comment.vo;

import lombok.Data;

import java.sql.Timestamp;

@Data
public class UserVO {
    private String userId;
    private String userName;
    private String userNickname;
    private String userEmail;
    private byte[] userImgUrl;
    private Timestamp createdDate;
    private Timestamp updatedDate;
}
