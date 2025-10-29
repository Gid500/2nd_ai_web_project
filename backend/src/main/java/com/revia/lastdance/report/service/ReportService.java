package com.revia.lastdance.report.service;

import com.revia.lastdance.report.dao.ReportDao;
import com.revia.lastdance.report.vo.ReportVo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

import com.revia.lastdance.post.dao.PostMapper;
import com.revia.lastdance.comment.dao.CommentDAO;

@Service
public class ReportService {

    @Autowired
    private ReportDao reportDao;

    @Autowired
    private PostMapper postMapper;

    @Autowired
    private CommentDAO commentDAO;

    // 모든 신고 조회
    public List<ReportVo> getAllReports() {
        return reportDao.getAllReports();
    }

    // 특정 신고 조회
    public ReportVo getReportById(int reportId) {
        return reportDao.getReportById(reportId);
    }

    // 신고 추가
    public void insertReport(ReportVo reportVo) {
        reportDao.insertReport(reportVo);
    }

    // 신고 상태 업데이트 및 게시물/댓글 삭제 처리
    public void updateReportStatus(ReportVo reportVo) {
        // 신고 상태 업데이트
        reportDao.updateReportStatus(reportVo);

        // 신고 상태가 '승인' (예: reportStatus = 2) 이고, 게시물 또는 댓글 ID가 있는 경우 삭제 처리
        if (reportVo.getReportStatus() == 2) { // 2는 '승인' 상태를 가정
            if (reportVo.getReportedPostId() != null) {
                postMapper.deletePost(reportVo.getReportedPostId());
                System.out.println("게시물 삭제 완료: " + reportVo.getReportedPostId());
            } else if (reportVo.getReportedCommentId() != null) {
                commentDAO.deleteComment(reportVo.getReportedCommentId());
                System.out.println("댓글 삭제 완료: " + reportVo.getReportedCommentId());
            }
        }
    }

    // 특정 게시물에 연결된 모든 신고의 상태를 업데이트
    public void updateReportsStatusByReportedPostId(int reportedPostId, int newStatus) {
        reportDao.updateReportsStatusByReportedPostId(reportedPostId, newStatus);
    }

    // 특정 댓글에 연결된 모든 신고의 상태를 업데이트
    public void updateReportsStatusByReportedCommentId(int reportedCommentId, int newStatus) {
        reportDao.updateReportsStatusByReportedCommentId(reportedCommentId, newStatus);
    }
}
