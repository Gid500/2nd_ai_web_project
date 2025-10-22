package com.revia.lastdance.flask.service;

import org.springframework.core.io.FileSystemResource;
import org.springframework.core.io.Resource;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import org.springframework.web.client.RestTemplate;

import java.io.File;
import java.io.IOException;

@Service
public class FileUploadService {

    // RestTemplate 인스턴스 생성
    private final RestTemplate restTemplate = new RestTemplate();
    // Flask 서버의 이미지 업로드 엔드포인트 URL
    private final String FLASK_SERVER_URL = "http://localhost:5000/upload-image"; 

    /**
     * 지정된 경로의 이미지 파일을 Flask 서버로 업로드합니다.
     * @param filePath 업로드할 이미지 파일의 전체 경로
     * @return 서버 응답 메시지 (성공 또는 실패)
     * @throws IOException 파일이 존재하지 않거나 접근할 수 없을 때 발생
     */
    public String uploadImageToFlask(String filePath) throws IOException {
        
        // 1. 요청 헤더 설정
        HttpHeaders headers = new HttpHeaders();
        // 필수: 서버에게 이 요청이 파일을 포함하는 멀티파트 폼 데이터임을 알립니다.
        headers.setContentType(MediaType.MULTIPART_FORM_DATA);

        // 2. 파일 Resource 생성
        File file = new File(filePath);
        if (!file.exists() || file.isDirectory()) {
            throw new IOException("파일을 찾을 수 없거나 올바른 파일이 아닙니다: " + filePath);
        }
        Resource fileResource = new FileSystemResource(file);

        // 3. 요청 본문(Body) 구성
        // MultiValueMap은 멀티파트 요청의 각 필드(키-값 쌍)를 담는 데 사용됩니다.
        MultiValueMap<String, Object> body = new LinkedMultiValueMap<>();
        // 필수: Flask 서버가 기대하는 필드 이름('file')과 파일 Resource를 연결합니다.
        body.add("file", fileResource); 
        // 텍스트 필드를 추가하는 예시 (선택적):
        body.add("description", "Spring Boot에서 보낸 이미지");

        // 4. 요청 Entity 생성 (헤더와 본문 결합)
        HttpEntity<MultiValueMap<String, Object>> requestEntity = new HttpEntity<>(body, headers);

        // 5. RestTemplate으로 POST 요청 전송
        try {
            // postForEntity를 사용하여 POST 요청을 보내고 서버 응답(JSON 문자열)을 받습니다.
            ResponseEntity<String> response = restTemplate.postForEntity(
                    FLASK_SERVER_URL, 
                    requestEntity, 
                    String.class // 응답 본문의 타입
            );

            // HTTP 상태 코드가 2xx 성공인지 확인
            if (response.getStatusCode().is2xxSuccessful()) {
                System.out.println("이미지 업로드 성공. 응답: " + response.getBody());
                return "업로드 성공: " + response.getBody();
            } else {
                System.err.println("이미지 업로드 실패. 상태 코드: " + response.getStatusCode());
                return "업로드 실패: " + response.getStatusCode() + ", 응답 본문: " + response.getBody();
            }
        } catch (Exception e) {
            // 연결 오류 또는 기타 예외 처리
            System.err.println("업로드 중 오류 발생: " + e.getMessage());
            e.printStackTrace();
            return "업로드 중 오류 발생: Flask 서버 연결 또는 처리 실패";
        }
    }
}