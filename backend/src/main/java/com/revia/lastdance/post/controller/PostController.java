package com.revia.lastdance.post.controller;

import com.revia.lastdance.post.service.PostService;
import com.revia.lastdance.post.vo.PostVO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/posts")
public class PostController {

    @Autowired
    private PostService postService;

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

    @PostMapping
    public ResponseEntity<Void> createPost(@RequestBody PostVO postVO) {
        postService.createPost(postVO);
        return new ResponseEntity<>(HttpStatus.CREATED);
    }

    @PostMapping("/update/{postId}")
    public ResponseEntity<Void> updatePost(@PathVariable("postId") int postId, @RequestBody PostVO postVO) {
        postVO.setPostId(postId);
        postService.updatePost(postVO);
        return new ResponseEntity<>(HttpStatus.OK);
    }

    @PostMapping("/delete/{postId}")
    public ResponseEntity<Void> deletePost(@PathVariable("postId") int postId) {
        postService.deletePost(postId);
        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }
}
