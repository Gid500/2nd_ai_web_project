package com.revia.lastdance.post.vo;

import lombok.Data;

import java.sql.Timestamp;
import java.util.List;

@Data
public class PostVO {
    private int postId;
    private String userId;
    private byte[] postContent; // BLOB type
    private Timestamp createdDate;
    private String createdId;
    private Timestamp updatedDate;
    private String updatedId;
    private List<FileVO> files;
}
