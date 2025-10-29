package com.revia.lastdance.user.vo;

import lombok.Data;

@Data
public class AdminUserVO {
    private String userId;
    private String userNickname;
    private String userEmail;
    private String roleType;
    private int reportCount;
}
