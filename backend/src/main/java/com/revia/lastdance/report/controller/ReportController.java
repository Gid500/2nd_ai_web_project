package com.revia.lastdance.report.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.revia.lastdance.report.service.ReportService;
import com.revia.lastdance.report.vo.ReportVo;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/report")
public class ReportController {

    @Autowired
    private ReportService reportService;

    @PostMapping
    public ResponseEntity<Void> addReport(@RequestBody ReportVo reportVo) {
        reportService.addReport(reportVo);
        return ResponseEntity.ok().build();
    }

    @GetMapping
    public ResponseEntity<Map<String, Object>> getAllReports(
            @RequestParam(defaultValue = "1") int page,
            @RequestParam(defaultValue = "10") int limit) {
        List<ReportVo> reports = reportService.getAllReports(page, limit);
        int totalReports = reportService.getTotalReportCount();

        Map<String, Object> response = new HashMap<>();
        response.put("reports", reports);
        response.put("totalReports", totalReports);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/{reportId}")
    public ResponseEntity<ReportVo> getReportById(@PathVariable int reportId) {
        ReportVo report = reportService.getReportById(reportId);
        return report != null ? ResponseEntity.ok(report) : ResponseEntity.notFound().build();
    }

    @PostMapping("/update") // PUT 대신 POST 사용
    public ResponseEntity<Void> updateReport(@RequestBody ReportVo reportVo) {
        reportService.updateReport(reportVo);
        return ResponseEntity.ok().build();
    }

    @PostMapping("/delete/{reportId}") // DELETE 대신 POST 사용
    public ResponseEntity<Void> deleteReport(@PathVariable int reportId) {
        reportService.deleteReport(reportId);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/types")
    public ResponseEntity<List<ReportVo>> getReportTypes() {
        List<ReportVo> reportTypes = reportService.getReportTypes();
        return ResponseEntity.ok(reportTypes);
    }
}
