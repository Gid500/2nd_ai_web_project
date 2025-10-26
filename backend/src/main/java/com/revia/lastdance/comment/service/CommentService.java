package com.revia.lastdance.comment.service;

import com.revia.lastdance.comment.dao.CommentDAO;
import com.revia.lastdance.comment.vo.CommentVO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.security.access.AccessDeniedException;

import java.util.List;

@Service
public class CommentService {

    @Autowired
    private CommentDAO commentDAO;

    public void addComment(CommentVO commentVO) {
        commentDAO.insertComment(commentVO);
    }

    public List<CommentVO> getCommentsByPostId(int postId) {
        return commentDAO.selectCommentsByPostId(postId);
    }

    public CommentVO getCommentById(int commentId) {
        return commentDAO.selectCommentById(commentId);
    }

    public void updateComment(CommentVO commentVO) {
        commentDAO.updateComment(commentVO);
    }

    public void deleteComment(int commentId, int userId, boolean isAdmin) {
        CommentVO comment = commentDAO.selectCommentById(commentId);
        if (comment == null) {
            throw new IllegalArgumentException("댓글을 찾을 수 없습니다.");
        }

        if (isAdmin || comment.getUserId() == userId) {
            commentDAO.deleteComment(commentId);
        } else {
            throw new AccessDeniedException("댓글을 삭제할 권한이 없습니다.");
        }
    }
}