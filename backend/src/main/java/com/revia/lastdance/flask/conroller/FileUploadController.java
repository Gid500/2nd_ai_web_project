package com.revia.lastdance.flask.conroller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.revia.lastdance.flask.service.FileUploadService;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;

@RestController
@RequestMapping("/api/upload")
public class FileUploadController {

    private final FileUploadService fileUploadService;

    // 생성자 주입을 통해 FileUploadService 의존성 주입
    public FileUploadController(FileUploadService fileUploadService) {
        this.fileUploadService = fileUploadService;
    }

    @PostMapping("/image")
    public ResponseEntity<String> uploadImage(@RequestParam("file") MultipartFile file) {
        if (file.isEmpty()) {
            return ResponseEntity.badRequest().body("파일이 비어 있습니다.");
        }

        try {
            // 임시 파일로 저장
            Path tempFile = Files.createTempFile(null, file.getOriginalFilename());
            file.transferTo(tempFile.toFile());

            // Flask 서버로 파일 업로드 및 응답 받기
            String flaskResponse = fileUploadService.uploadImageToFlask(tempFile.toAbsolutePath().toString());

            // 임시 파일 삭제
            Files.delete(tempFile);

            // Flask 서버의 응답을 클라이언트에 반환
            return ResponseEntity.ok(flaskResponse);

        } catch (IOException e) {
            e.printStackTrace();
            return ResponseEntity.status(500).body("파일 업로드 중 오류 발생: " + e.getMessage());
        }
    }
}