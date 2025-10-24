package com.revia.lastdance.comment.dao;

import com.revia.lastdance.comment.vo.CommentVO;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;

@Mapper
public interface CommentMapper {
    void insertComment(CommentVO commentVO);
    List<CommentVO> selectCommentsByPostId(@Param("postId") int postId);
    void updateComment(CommentVO commentVO);
    void deleteComment(@Param("commentId") int commentId);
    CommentVO selectCommentById(@Param("commentId") int commentId);
}
