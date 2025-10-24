package com.revia.lastdance.post.controller;

import com.revia.lastdance.post.service.FileService;
import com.revia.lastdance.post.vo.FileVO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;

@RestController
@RequestMapping("/posts/{postId}/files")
public class PostFileController {

    @Autowired
    private FileService fileService;

    @PostMapping
    public ResponseEntity<String> uploadFile(@PathVariable("postId") int postId,
                                             @RequestParam("files") MultipartFile[] files) {
        try {
            fileService.uploadFile(files, postId);
            return new ResponseEntity<>("Files uploaded successfully", HttpStatus.CREATED);
        } catch (IOException e) {
            return new ResponseEntity<>("Failed to upload files: " + e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @GetMapping
    public ResponseEntity<List<FileVO>> getFilesByPostId(@PathVariable("postId") int postId) {
        List<FileVO> files = fileService.getFilesByPostId(postId);
        return new ResponseEntity<>(files, HttpStatus.OK);
    }

    @DeleteMapping("/{fileId}")
    public ResponseEntity<String> deleteFile(@PathVariable("fileId") int fileId) {
        fileService.deleteFile(fileId);
        return new ResponseEntity<>("File deleted successfully", HttpStatus.NO_CONTENT);
    }
}
