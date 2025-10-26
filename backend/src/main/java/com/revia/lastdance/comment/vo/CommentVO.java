package com.revia.lastdance.comment.vo;

import lombok.Data;

import java.time.LocalDateTime;

@Data
public class CommentVO {
    private int commentId;
    private int postId;
    private int userId;
    private String content;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private String userName;
}