package com.revia.lastdance.comment.service;

import com.revia.lastdance.comment.dao.CommentMapper;
import com.revia.lastdance.comment.vo.CommentVO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class CommentService {

    @Autowired
    private CommentMapper commentMapper;

    public void createComment(CommentVO commentVO) {
        commentMapper.insertComment(commentVO);
    }

    public List<CommentVO> getCommentsByPostId(int postId) {
        return commentMapper.selectCommentsByPostId(postId);
    }

    public void updateComment(CommentVO commentVO) {
        commentMapper.updateComment(commentVO);
    }

    public void deleteComment(int commentId) {
        commentMapper.deleteComment(commentId);
    }

    public CommentVO getCommentById(int commentId) {
        return commentMapper.selectCommentById(commentId);
    }
}
