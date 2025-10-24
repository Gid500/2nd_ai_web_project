package com.revia.lastdance.flask.conroller;

import com.revia.lastdance.flask.service.FileUploadService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.Map;

@RestController
@RequestMapping("/api/flask")
public class FileUploadController {

    @Autowired
    private FileUploadService fileUploadService;

    @PostMapping("/uploadCatImage")
    public ResponseEntity<?> uploadCatImage(@RequestParam("file") MultipartFile file) {
        try {
            Map<String, Object> predictionResult = fileUploadService.uploadCatImageAndGetPrediction(file);
            return ResponseEntity.ok(predictionResult);
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Error uploading cat image: " + e.getMessage());
        }
    }

    @PostMapping("/uploadDogImage")
    public ResponseEntity<?> uploadDogImage(@RequestParam("file") MultipartFile file) {
        try {
            Map<String, Object> predictionResult = fileUploadService.uploadDogImageAndGetPrediction(file);
            return ResponseEntity.ok(predictionResult);
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Error uploading dog image: " + e.getMessage());
        }
    }
}
