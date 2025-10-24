package com.revia.lastdance.post.vo;

import lombok.Data;

import java.sql.Timestamp;
import java.util.List;

@Data
public class PostVO {
    private int postId;
    private String userId;
    private String postTitle; // Added
    private String postContent;
    private Boolean isNotice;
    private Timestamp createdDate;
    private String createdId;
    private Timestamp updatedDate;
    private String updatedId;
    private String anoyUserName; // Added
    private String anoyUserPwd; // Added
    private List<FileVO> files;
}
