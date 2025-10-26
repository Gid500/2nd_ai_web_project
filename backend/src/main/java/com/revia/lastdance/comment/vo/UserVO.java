package com.revia.lastdance.comment.vo;

import lombok.Data;

import java.time.LocalDateTime; // Changed from java.sql.Timestamp

@Data
public class UserVO {
    private String userId;
    private String userNickname;
    private String userEmail;
    private String userImgUrl; // Changed from byte[] to String
    private LocalDateTime createdDate; // Changed from Timestamp
    private LocalDateTime updatedDate; // Changed from Timestamp
}
