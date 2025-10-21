package com.revia.lastdance.post.vo;

import lombok.Data;

import java.sql.Timestamp;

@Data
public class PostVO {
    private int postId;
    private String userId;
    private byte[] postContent; // BLOB type
    private Timestamp createdDate;
    private String createdId;
    private Timestamp updatedDate;
    private String updatedId;
}
