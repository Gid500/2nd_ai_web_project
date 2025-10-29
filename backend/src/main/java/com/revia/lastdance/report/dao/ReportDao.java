package com.revia.lastdance.report.dao;

import com.revia.lastdance.report.vo.ReportVo;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;

@Mapper
public interface ReportDao {
    List<ReportVo> getAllReports();
    ReportVo getReportById(int reportId);
    void insertReport(ReportVo reportVo);
    void updateReportStatus(ReportVo reportVo);
    void updateReportsStatusByReportedPostId(@Param("reportedPostId") int reportedPostId, @Param("newStatus") int newStatus);
    void updateReportsStatusByReportedCommentId(@Param("reportedCommentId") int reportedCommentId, @Param("newStatus") int newStatus);
}
