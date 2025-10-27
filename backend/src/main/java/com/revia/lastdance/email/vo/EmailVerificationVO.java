package com.revia.lastdance.email.vo;

import lombok.Data;

import java.time.LocalDateTime;

@Data
public class EmailVerificationVO {
    private String userEmail;
    private String emailCode;
    private LocalDateTime verifiTime;
}
