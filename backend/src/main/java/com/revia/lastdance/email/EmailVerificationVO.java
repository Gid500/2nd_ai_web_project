package com.revia.lastdance.email;

import lombok.Data;

import java.sql.Timestamp;

@Data
public class EmailVerificationVO {
    private String userEmail;
    private String emailCode;
    private Timestamp verifiTime;
}
