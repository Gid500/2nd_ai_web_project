package com.revia.lastdance.flask.service;

import com.revia.lastdance.flask.dao.FlaskImgMapper;
import com.revia.lastdance.flask.vo.FlaskImgVO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
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

    @Value("${file.upload-dir}")
    private String UPLOAD_DIR;

    @Value("${flask.api.base-url}")
    private String flaskApiBaseUrl;

    private Map<String, Object> sendImageToFlask(MultipartFile file, String flaskUrl) throws Exception {
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

        ResponseEntity<Map> flaskResponse = restTemplate.postForEntity(flaskUrl, flaskRequestEntity, Map.class);

        if (flaskResponse.getStatusCode().is2xxSuccessful()) {
            return flaskResponse.getBody();
        } else {
            throw new RuntimeException("Failed to get prediction from Flask AI backend: " + flaskResponse.getStatusCode());
        }
    }

    public Map<String, Object> uploadCatImageAndGetPrediction(MultipartFile file) throws Exception {
        // Save the file locally
        String originalFilename = file.getOriginalFilename();
        String uniqueFilename = UUID.randomUUID().toString() + "_" + originalFilename;
        Path filePath = Paths.get(UPLOAD_DIR, uniqueFilename);
        Files.createDirectories(filePath.getParent()); // Ensure the directory exists
        Files.write(filePath, file.getBytes());

        // Save image info to database
        FlaskImgVO flaskImgVO = new FlaskImgVO();
        flaskImgVO.setFlaskImgUrl(filePath.toString());
        flaskImgVO.setFlaskImgName(originalFilename);
        flaskImgMapper.insertFlaskImg(flaskImgVO);

        return sendImageToFlask(file, flaskApiBaseUrl + "/upload-cat-image");
    }

    public Map<String, Object> uploadDogImageAndGetPrediction(MultipartFile file) throws Exception {
        // Save the file locally
        String originalFilename = file.getOriginalFilename();
        String uniqueFilename = UUID.randomUUID().toString() + "_" + originalFilename;
        Path filePath = Paths.get(UPLOAD_DIR, uniqueFilename);
        Files.createDirectories(filePath.getParent()); // Ensure the directory exists
        Files.write(filePath, file.getBytes());

        // Save image info to database
        FlaskImgVO flaskImgVO = new FlaskImgVO();
        flaskImgVO.setFlaskImgUrl(filePath.toString());
        flaskImgVO.setFlaskImgName(originalFilename);
        flaskImgMapper.insertFlaskImg(flaskImgVO);

        return sendImageToFlask(file, flaskApiBaseUrl + "/upload-dog-image");
    }
}
