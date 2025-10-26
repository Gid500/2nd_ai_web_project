package com.revia.lastdance.post.controller;

import com.revia.lastdance.post.service.PostService;
import com.revia.lastdance.post.vo.PostVO;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.security.Principal;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/posts") // Changed mapping to /api/posts
@RequiredArgsConstructor
public class PostController {

    private final PostService postService;

    @GetMapping
    public ResponseEntity<Map<String, Object>> getAllPosts(
            @RequestParam(defaultValue = "1") int page,
            @RequestParam(defaultValue = "10") int size) {
        Map<String, Object> postsData = postService.getAllPosts(page, size);
        return new ResponseEntity<>(postsData, HttpStatus.OK);
    }

    @GetMapping("/notices/top/{count}")
    public ResponseEntity<List<PostVO>> getTopNotices(@PathVariable("count") int count) {
        List<PostVO> notices = postService.getTopNotices(count);
        return new ResponseEntity<>(notices, HttpStatus.OK);
    }

    @GetMapping("/{postId}")
    public ResponseEntity<PostVO> getPostById(@PathVariable("postId") int postId) {
        PostVO post = postService.getPostById(postId);
        if (post != null) {
            return new ResponseEntity<>(post, HttpStatus.OK);
        } else {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }

    @PostMapping("/create")
    public ResponseEntity<Void> createPost(
            @RequestPart("post") PostVO postVO,
            @RequestPart(value = "files", required = false) List<MultipartFile> files,
            Principal principal) {
        postService.createPost(postVO, files, principal);
        return new ResponseEntity<>(HttpStatus.CREATED);
    }

    @PostMapping("/update") // PUT 대신 POST 사용
    @PreAuthorize("hasAnyAuthority('ROLE_ADMIN', 'ROLE_admin') or @postService.isOwner(#postVO.postId, #postVO.userId)") // userId를 PostVO에서 가져옴
    public ResponseEntity<Void> updatePost(
            @RequestPart("post") PostVO postVO,
            @RequestPart(value = "files", required = false) List<MultipartFile> files) {
        // postId는 PostVO 안에 이미 포함되어 있으므로 별도로 설정할 필요 없음
        postService.updatePost(postVO, files);
        return new ResponseEntity<>(HttpStatus.OK);
    }

    @DeleteMapping("/delete/{postId}") // Changed to DeleteMapping
    @PreAuthorize("hasAnyAuthority('ROLE_ADMIN', 'ROLE_admin') or @postService.isOwner(#postId, authentication.principal.userId)")
    public ResponseEntity<Void> deletePost(@PathVariable("postId") int postId) {
        postService.deletePost(postId);
        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }
}
