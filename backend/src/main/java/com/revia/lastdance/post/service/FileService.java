package com.revia.lastdance.post.service;

import com.revia.lastdance.post.dao.FileMapper;
import com.revia.lastdance.post.vo.FileVO;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class FileService {

    private static final Logger logger = LoggerFactory.getLogger(FileService.class);

    private final FileMapper fileMapper;

    // 파일 저장 기본 경로 (프로젝트 루트의 uploaded_img 디렉토리)
    private final String UPLOAD_DIR = "uploaded_img/";

    public void uploadFiles(int postId, List<MultipartFile> files) {
        if (files != null && !files.isEmpty()) {
            for (MultipartFile file : files) {
                if (!file.isEmpty()) {
                    try {
                        // 파일 저장 경로 생성
                        Path uploadPath = Paths.get(UPLOAD_DIR);
                        if (!Files.exists(uploadPath)) {
                            Files.createDirectories(uploadPath);
                        }

                        // 고유한 파일 이름 생성
                        String originalFileName = file.getOriginalFilename();
                        String storedFileName = UUID.randomUUID().toString() + "_" + originalFileName;
                        Path filePath = uploadPath.resolve(storedFileName);

                        // 파일 저장
                        Files.copy(file.getInputStream(), filePath);

                        // 파일 정보 DB에 저장
                        FileVO fileVO = new FileVO();
                        fileVO.setPostId(postId);
                        fileVO.setUploadName(originalFileName);
                        fileVO.setFileType(file.getContentType());
                        fileVO.setImgUrl("/images/" + storedFileName); // 저장된 파일 경로를 URL 패턴에 맞게 수정
                        fileMapper.insertFile(fileVO);

                    } catch (IOException e) {
                        logger.error("파일 업로드 실패: {}", e.getMessage());
                        throw new RuntimeException("파일 업로드에 실패했습니다.", e);
                    }
                }
            }
        }
    }

    public void deleteFilesByPostId(int postId) {
        // DB에서 파일 정보 조회
        List<FileVO> filesToDelete = fileMapper.selectFilesByPostId(postId);

        // 실제 파일 시스템에서 파일 삭제
        for (FileVO file : filesToDelete) {
            try {
                // 파일 시스템에서 삭제할 경로를 UPLOAD_DIR 기준으로 재구성
                String fileName = Paths.get(file.getImgUrl()).getFileName().toString(); // /images/ 접두사 제거
                Path filePath = Paths.get(UPLOAD_DIR).resolve(fileName);
                Files.deleteIfExists(filePath);
            } catch (IOException e) {
                logger.warn("파일 시스템에서 파일 삭제 실패: {} (파일 경로: {})", e.getMessage(), file.getImgUrl());
                // 파일 시스템에서 삭제 실패해도 DB에서는 삭제 진행
            }
        }

        // DB에서 파일 정보 삭제
        fileMapper.deleteFilesByPostId(postId);
    }

    // 특정 파일 ID에 해당하는 파일 삭제 메서드
    public void deleteFile(int fileId) {
        FileVO fileToDelete = fileMapper.selectFileById(fileId);
        if (fileToDelete != null) {
            try {
                // 파일 시스템에서 삭제할 경로를 UPLOAD_DIR 기준으로 재구성
                String fileName = Paths.get(fileToDelete.getImgUrl()).getFileName().toString(); // /images/ 접두사 제거
                Path filePath = Paths.get(UPLOAD_DIR).resolve(fileName);
                Files.deleteIfExists(filePath);
            } catch (IOException e) {
                logger.warn("파일 시스템에서 파일 삭제 실패: {} (파일 경로: {})", e.getMessage(), fileToDelete.getImgUrl());
            }
            fileMapper.deleteFile(fileId); // DB에서 파일 정보 삭제
        }
    }

    // postId로 파일 목록을 조회하는 메서드 추가
    public List<FileVO> getFilesByPostId(int postId) {
        return fileMapper.selectFilesByPostId(postId);
    }
}