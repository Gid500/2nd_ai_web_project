package com.revia.lastdance.report.dao;

import org.apache.ibatis.annotations.Mapper;

import com.revia.lastdance.report.vo.ReportVo;

import java.util.List;

@Mapper
public interface ReportDao {
    void insertReport(ReportVo reportVo);
    List<ReportVo> selectAllReports();
    ReportVo selectReportById(int reportId);
    void updateReport(ReportVo reportVo);
    void deleteReport(int reportId);
    List<ReportVo> selectReportTypes();
    List<ReportVo> selectReportsByContentType(String reportContentType);
}
