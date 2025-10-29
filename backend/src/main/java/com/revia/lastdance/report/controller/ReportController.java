package com.revia.lastdance.report.controller;

import com.revia.lastdance.report.service.ReportService;
import com.revia.lastdance.report.vo.ReportVo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.security.access.prepost.PreAuthorize;

import java.util.List;

@RestController
@RequestMapping("/api/report")
public class ReportController {

    @Autowired
    private ReportService reportService;

    // 모든 신고 조회 (관리자만 가능)
    @PreAuthorize("hasRole('admin')")
    @GetMapping
    public ResponseEntity<List<ReportVo>> getAllReports() {
        List<ReportVo> reports = reportService.getAllReports();
        return new ResponseEntity<>(reports, HttpStatus.OK);
    }

    // 특정 신고 조회 (관리자만 가능)
    @PreAuthorize("hasRole('admin')")
    @GetMapping("/{reportId}")
    public ResponseEntity<ReportVo> getReportById(@PathVariable("reportId") int reportId) {
        ReportVo report = reportService.getReportById(reportId);
        if (report != null) {
            return new ResponseEntity<>(report, HttpStatus.OK);
        } else {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }

    // 신고 추가 (모든 사용자 가능)
    @PostMapping
    public ResponseEntity<Void> insertReport(@RequestBody ReportVo reportVo) {
        reportService.insertReport(reportVo);
        return new ResponseEntity<>(HttpStatus.CREATED);
    }

    // 신고 상태 업데이트 (관리자만 가능)
    @PreAuthorize("hasRole('admin')")
    @PutMapping("/{reportId}/status")
    public ResponseEntity<Void> updateReportStatus(@PathVariable("reportId") int reportId, @RequestBody ReportVo reportVo) {
        ReportVo existingReport = reportService.getReportById(reportId);
        if (existingReport == null) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
        existingReport.setReportStatus(reportVo.getReportStatus());
        reportService.updateReportStatus(existingReport);
        return new ResponseEntity<>(HttpStatus.OK);
    }
}
