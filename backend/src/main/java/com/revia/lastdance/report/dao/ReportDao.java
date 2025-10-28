package com.revia.lastdance.report.dao;

import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import com.revia.lastdance.report.vo.ReportVo;

import java.util.List;

@Mapper
public interface ReportDao {
    void insertReport(ReportVo reportVo);
    List<ReportVo> selectAllReports(@Param("limit") int limit, @Param("offset") int offset);
    int selectTotalReportCount();
    ReportVo selectReportById(int reportId);
    void updateReport(ReportVo reportVo);
    void deleteReport(int reportId);
    List<ReportVo> selectReportTypes();
    List<ReportVo> selectReportsByContentType(String reportContentType);
}
