package com.revia.lastdance.comment.vo;

import lombok.Data;

import java.time.LocalDateTime;

@Data
public class CommentVO {
    private int commentId;
    private int postId;
    private String userId;
    private String comment; // Renamed from content
    private LocalDateTime createdDate; // Renamed from createdAt
    private LocalDateTime updatedDate; // Renamed from updatedAt
    private String userNickname; // Renamed from userName
}