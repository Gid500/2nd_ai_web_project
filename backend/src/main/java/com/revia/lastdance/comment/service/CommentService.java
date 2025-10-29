package com.revia.lastdance.comment.service;

import com.revia.lastdance.comment.dao.CommentDAO;
import com.revia.lastdance.comment.vo.CommentVO;
import com.revia.lastdance.report.service.ReportService; // ReportService 임포트
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.security.access.AccessDeniedException;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class CommentService {

    @Autowired
    private CommentDAO commentDAO;

    @Autowired
    private ReportService reportService; // ReportService 주입

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

    public void deleteComment(int commentId, String userId, boolean isAdmin) { // userId 타입을 String으로 변경
        CommentVO comment = commentDAO.selectCommentById(commentId);
        if (comment == null) {
            throw new IllegalArgumentException("댓글을 찾을 수 없습니다.");
        }

        if (isAdmin || comment.getUserId().equals(userId)) { // String 비교는 .equals() 사용
            reportService.deleteReportsByReportedCommentId(commentId); // 댓글에 연결된 신고 삭제
            commentDAO.deleteComment(commentId);
        } else {
            throw new AccessDeniedException("댓글을 삭제할 권한이 없습니다.");
        }
    }

    public Map<String, Object> getAllComments(int page, int size) {
        int offset = (page - 1) * size;
        List<CommentVO> comments = commentDAO.selectPaginatedComments(offset, size);
        int totalComments = commentDAO.countAllComments();

        Map<String, Object> result = new HashMap<>();
        result.put("comments", comments);
        result.put("totalComments", totalComments);
        return result;
    }
}