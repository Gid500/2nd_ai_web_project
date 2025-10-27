package com.revia.lastdance.report.vo;

import lombok.Data;
import java.sql.Timestamp;

@Data
public class ReportVo {
    private int reportId;
    private Integer reportedPostId; // 추가
    private Integer reportedCommentId; // 추가
    private String reporterUserId;
    private String reportedUserId;
    private String reportContent;
    private int reportTypeId;
    private String reportContentType;
    private String typeName; // tb_report_type과 조인하여 가져올 필드
}
