package com.revia.lastdance.post.vo;

import lombok.Data;

import java.sql.Timestamp;
import java.util.List;

@Data
public class PostVO {
    private int postId;
    private String userId;
    private String postTitle; // Added
    private String postContent;
    private Boolean isNotice;
    private Integer postViewCunt; // 조회수 추가
    private Timestamp createdDate;
    private String createdId;
    private Timestamp updatedDate;
    private String updatedId;
    private List<FileVO> files;
    private List<Integer> deletedFileIds; // 추가: 삭제할 파일 ID 목록

    // 검색 필드
    private String searchType;
    private String searchKeyword;
}
