package com.revia.lastdance.report.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.revia.lastdance.report.dao.ReportDao;
import com.revia.lastdance.report.vo.ReportVo;

import java.util.List;

@Service
public class ReportService {

    @Autowired
    private ReportDao reportDao;

    public void addReport(ReportVo reportVo) {
        // 신고 유형에 따른 로직 추가 (예: 유효성 검사 및 reportContentType 설정)
        if (reportVo.getReportedPostId() != null && reportVo.getReportedCommentId() != null) {
            // 댓글 신고
            reportVo.setReportContentType("comment"); // reportContentType 설정
            System.out.println("댓글 신고가 접수되었습니다. 게시글 ID: " + reportVo.getReportedPostId() + ", 댓글 ID: " + reportVo.getReportedCommentId());
        } else if (reportVo.getReportedPostId() != null && reportVo.getReportedCommentId() == null) {
            // 게시글 신고
            reportVo.setReportContentType("post"); // reportContentType 설정
            System.out.println("게시글 신고가 접수되었습니다. 게시글 ID: " + reportVo.getReportedPostId());
        } else {
            // 유효하지 않은 신고 (둘 다 null이거나 commentId만 있는 경우)
            throw new IllegalArgumentException("유효하지 않은 신고 요청입니다. reportedPostId 또는 reportedCommentId가 올바르지 않습니다.");
        }
        reportDao.insertReport(reportVo);
    }

    public List<ReportVo> getAllReports(int page, int limit) {
        int offset = (page - 1) * limit;
        return reportDao.selectAllReports(limit, offset);
    }

    public int getTotalReportCount() {
        return reportDao.selectTotalReportCount();
    }

    public ReportVo getReportById(int reportId) {
        return reportDao.selectReportById(reportId);
    }

    public void updateReport(ReportVo reportVo) {
        reportDao.updateReport(reportVo);
    }

    public void deleteReport(int reportId) {
        reportDao.deleteReport(reportId);
    }

    public void deleteReportsByReportedPostId(int reportedPostId) {
        reportDao.deleteReportsByReportedPostId(reportedPostId);
    }

    public void deleteReportsByReportedCommentId(int reportedCommentId) {
        reportDao.deleteReportsByReportedCommentId(reportedCommentId);
    }

    public List<ReportVo> getReportTypes() {
        return reportDao.selectReportTypes();
    }

    public List<ReportVo> selectReportsByContentType(String reportContentType) {
        return reportDao.selectReportsByContentType(reportContentType);
    }
}
