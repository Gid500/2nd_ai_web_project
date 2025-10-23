package com.revia.lastdance.flask.service;

import com.revia.lastdance.flask.dao.FlaskImgMapper;
import com.revia.lastdance.flask.vo.FlaskImgVO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.ByteArrayResource;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.multipart.MultipartFile;

import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.Map;
import java.util.UUID;

@Service
public class FileUploadService {

    @Autowired
    private FlaskImgMapper flaskImgMapper;

    @Autowired
    private RestTemplate restTemplate; // Assuming RestTemplate is configured

    private final String UPLOAD_DIR = "/home/qod120/Documents/project/2nd_ai_web_project/ai_backend/uploaded_img/";
    private final String FLASK_AI_PREDICT_URL = "http://localhost:5000/upload-image"; // Flask AI backend URL

    public Map<String, Object> uploadImageAndGetPrediction(MultipartFile file) throws Exception {
        // 1. Save the uploaded file
        String originalFilename = file.getOriginalFilename();
        String uniqueFilename = UUID.randomUUID().toString() + "_" + originalFilename;
        Path filePath = Paths.get(UPLOAD_DIR + uniqueFilename);
        Files.copy(file.getInputStream(), filePath);

        // 2. Store image info in DB
        FlaskImgVO flaskImgVO = new FlaskImgVO();
        flaskImgVO.setFlaskImgUrl(filePath.toString()); // Store local path for now
        flaskImgVO.setFlaskImgName(uniqueFilename);
        flaskImgMapper.insertFlaskImg(flaskImgVO);

        // 3. Send image to Flask AI backend for prediction
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.MULTIPART_FORM_DATA);

        MultiValueMap<String, Object> flaskBody = new LinkedMultiValueMap<>();
        flaskBody.add("file", new ByteArrayResource(file.getBytes()) {
            @Override
            public String getFilename() {
                return file.getOriginalFilename();
            }
        });

        HttpEntity<MultiValueMap<String, Object>> flaskRequestEntity = new HttpEntity<>(flaskBody, headers);

        ResponseEntity<Map> flaskResponse = restTemplate.postForEntity(FLASK_AI_PREDICT_URL, flaskRequestEntity, Map.class);

        if (flaskResponse.getStatusCode().is2xxSuccessful()) {
            return flaskResponse.getBody();
        } else {
            throw new RuntimeException("Failed to get prediction from Flask AI backend: " + flaskResponse.getStatusCode());
        }
    }
}
