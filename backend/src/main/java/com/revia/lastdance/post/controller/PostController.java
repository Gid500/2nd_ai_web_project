package com.revia.lastdance.post.controller;

import com.revia.lastdance.post.service.PostService;
import com.revia.lastdance.post.vo.PostVO;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.util.List;

@RestController
@RequestMapping("/api/posts") // Changed mapping to /api/posts
@RequiredArgsConstructor
public class PostController {

    private final PostService postService;

    @GetMapping
    public ResponseEntity<List<PostVO>> getAllPosts() {
        List<PostVO> posts = postService.getAllPosts();
        return new ResponseEntity<>(posts, HttpStatus.OK);
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
    public ResponseEntity<Void> createPost(@RequestBody PostVO postVO, Principal principal) {
        postService.createPost(postVO, principal);
        return new ResponseEntity<>(HttpStatus.CREATED);
    }

    @PutMapping("/update/{postId}") // Changed to PutMapping
    @PreAuthorize("hasRole('ADMIN') or @postService.isOwner(#postId, principal.userId)")
    public ResponseEntity<Void> updatePost(@PathVariable("postId") int postId, @RequestBody PostVO postVO) {
        postVO.setPostId(postId);
        postService.updatePost(postVO);
        return new ResponseEntity<>(HttpStatus.OK);
    }

    @DeleteMapping("/delete/{postId}") // Changed to DeleteMapping
    @PreAuthorize("hasRole('ADMIN') or @postService.isOwner(#postId, principal.userId)")
    public ResponseEntity<Void> deletePost(@PathVariable("postId") int postId) {
        postService.deletePost(postId);
        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }
}
