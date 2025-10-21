package com.revia.lastdance.post.service;

import com.revia.lastdance.post.dao.FileMapper;
import com.revia.lastdance.post.vo.FileVO;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.List;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

@Service
public class FileService {

    @Autowired
    private FileMapper fileMapper;

    @Value("${file.upload-dir}")
    private String uploadDir;

    public void uploadFile(MultipartFile file, int postId) throws IOException {
        // Ensure the upload directory exists
        Path uploadPath = Paths.get(uploadDir);
        if (!Files.exists(uploadPath)) {
            Files.createDirectories(uploadPath);
        }

        String originalFileName = file.getOriginalFilename();
        String fileExtension = originalFileName.substring(originalFileName.lastIndexOf("."));
        String uniqueFileName = UUID.randomUUID().toString() + fileExtension;
        Path filePath = uploadPath.resolve(uniqueFileName);
        Files.copy(file.getInputStream(), filePath);

        FileVO fileVO = new FileVO();
        fileVO.setPostId(postId);
        fileVO.setUploadName(uniqueFileName);
        fileVO.setFileType(file.getContentType());
        fileVO.setFileSize((int) file.getSize());

        fileMapper.insertFile(fileVO);
    }

    public List<FileVO> getFilesByPostId(int postId) {
        return fileMapper.selectFilesByPostId(postId);
    }

    public void deleteFile(int fileId) {
        // TODO: Also delete the file from the file system
        fileMapper.deleteFile(fileId);
    }
}
