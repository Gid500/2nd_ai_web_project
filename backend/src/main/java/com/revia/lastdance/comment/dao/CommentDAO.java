package com.revia.lastdance.comment.dao;

import com.revia.lastdance.comment.vo.CommentVO;
import org.apache.ibatis.annotations.Mapper;

import java.util.List;

@Mapper
public interface CommentDAO {
    void insertComment(CommentVO commentVO);
    List<CommentVO> selectCommentsByPostId(int postId);
    CommentVO selectCommentById(int commentId);
    void updateComment(CommentVO commentVO);
    void deleteComment(int commentId);

}