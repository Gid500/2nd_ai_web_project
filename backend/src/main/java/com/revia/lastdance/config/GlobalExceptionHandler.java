package com.revia.lastdance.config;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;

import java.util.HashMap;
import java.util.Map;

@ControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(EmailSendingException.class)
    public ResponseEntity<Map<String, String>> handleEmailSendingException(EmailSendingException ex) {
        Map<String, String> errorResponse = new HashMap<>();
        errorResponse.put("error", "Email Sending Failed");
        errorResponse.put("message", ex.getMessage());
        return new ResponseEntity<>(errorResponse, HttpStatus.INTERNAL_SERVER_ERROR);
    }

    // 다른 예외 핸들러들을 여기에 추가할 수 있습니다.
    // 예를 들어, IllegalArgumentException, MethodArgumentNotValidException 등
}
