package com.revia.lastdance.post.dao;

import com.revia.lastdance.post.vo.FileVO;
import org.apache.ibatis.annotations.Mapper;

import java.util.List;

@Mapper
public interface FileMapper {
    void insertFile(FileVO fileVO);
    List<FileVO> selectFilesByPostId(int postId);
    FileVO selectFileById(int fileId);
    void deleteFile(int fileId);
    void deleteFilesByPostId(int postId); // 추가
}
