package com.revia.lastdance.flask.service;

import com.revia.lastdance.flask.vo.OpenAIAnalysisResponseVO;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.multipart.MultipartFile;

import java.util.Map;

@Service
public class FlaskService {

    @Value("${flask.api.base-url}")
    private String flaskApiBaseUrl;

    private final RestTemplate restTemplate;

    public FlaskService(RestTemplate restTemplate) {
        this.restTemplate = restTemplate;
    }

    public OpenAIAnalysisResponseVO getOpenAIAnalysis(MultipartFile file, String animalType) {
        String url = flaskApiBaseUrl;
        if ("cat".equalsIgnoreCase(animalType)) {
            url += "/upload-cat-image";
        } else if ("dog".equalsIgnoreCase(animalType)) {
            url += "/upload-dog-image";
        } else {
            throw new IllegalArgumentException("Invalid animal type: " + animalType);
        }

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.MULTIPART_FORM_DATA);

        MultiValueMap<String, Object> body = new LinkedMultiValueMap<>();
        body.add("file", file.getResource());

        HttpEntity<MultiValueMap<String, Object>> requestEntity = new HttpEntity<>(body, headers);

        ResponseEntity<Map> response = restTemplate.postForEntity(url, requestEntity, Map.class);

        if (response.getStatusCode().is2xxSuccessful() && response.getBody() != null) {
            Map<String, Object> responseBody = response.getBody();
            if (responseBody.containsKey("openai_analysis")) {
                OpenAIAnalysisResponseVO vo = new OpenAIAnalysisResponseVO();
                vo.setOpenaiAnalysis(responseBody.get("openai_analysis").toString());
                return vo;
            }
        }
        return null; // Or throw an exception
    }
}
