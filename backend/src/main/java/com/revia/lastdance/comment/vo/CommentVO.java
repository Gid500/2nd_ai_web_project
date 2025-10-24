package com.revia.lastdance.comment.vo;

import com.revia.lastdance.post.vo.PostVO;
import lombok.Data;

import java.sql.Timestamp;

@Data
public class CommentVO {
    private int commentId;
    private String userId;
    private int postId;
    private String comment;
    private Timestamp createdDate;
    private String createdId;
    private Timestamp updatedDate;
    private String updatedId;

    private UserVO user;
    private PostVO post;
}
