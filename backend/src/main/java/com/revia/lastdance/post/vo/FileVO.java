package com.revia.lastdance.post.vo;

import lombok.Data;

@Data
public class FileVO {
    private int fileId;
    private int postId;
    private String uploadName;
    private String fileType;
    private String imgUrl;
}
