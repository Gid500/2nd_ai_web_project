package com.revia.lastdance.flask.conroller;

import com.revia.lastdance.flask.service.FlaskService;
import com.revia.lastdance.flask.vo.OpenAIAnalysisResponseVO;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping("/api/flask")
public class FlaskController {

    private final FlaskService flaskService;

    public FlaskController(FlaskService flaskService) {
        this.flaskService = flaskService;
    }

    @PostMapping("/openai-analysis")
    public ResponseEntity<OpenAIAnalysisResponseVO> getOpenAIAnalysis(
            @RequestParam("file") MultipartFile file,
            @RequestParam("animalType") String animalType) {
        try {
            OpenAIAnalysisResponseVO analysis = flaskService.getOpenAIAnalysis(file, animalType);
            return ResponseEntity.ok(analysis);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().build();
        } catch (Exception e) {
            return ResponseEntity.internalServerError().build();
        }
    }
}
