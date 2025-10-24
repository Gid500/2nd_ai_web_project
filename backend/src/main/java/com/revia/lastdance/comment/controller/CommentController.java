package com.revia.lastdance.comment.controller;

import com.revia.lastdance.comment.service.CommentService;
import com.revia.lastdance.comment.vo.CommentVO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/posts/{postId}/comments")
public class CommentController {

    @Autowired
    private CommentService commentService;

    @PostMapping
    public ResponseEntity<Void> createComment(@PathVariable("postId") int postId,
                                              @RequestBody CommentVO commentVO) {
        commentVO.setPostId(postId);
        commentService.createComment(commentVO);
        return new ResponseEntity<>(HttpStatus.CREATED);
    }

    @GetMapping
    public ResponseEntity<List<CommentVO>> getCommentsByPostId(@PathVariable("postId") int postId) {
        List<CommentVO> comments = commentService.getCommentsByPostId(postId);
        return new ResponseEntity<>(comments, HttpStatus.OK);
    }

    @GetMapping("/{commentId}")
    public ResponseEntity<CommentVO> getCommentById(@PathVariable("commentId") int commentId) {
        CommentVO comment = commentService.getCommentById(commentId);
        if (comment != null) {
            return new ResponseEntity<>(comment, HttpStatus.OK);
        } else {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }

    @PostMapping("/{commentId}/update")
    public ResponseEntity<Void> updateComment(@PathVariable("commentId") int commentId,
                                              @RequestBody CommentVO commentVO) {
        commentVO.setCommentId(commentId);
        commentService.updateComment(commentVO);
        return new ResponseEntity<>(HttpStatus.OK);
    }

    @PostMapping("/{commentId}/delete")
    public ResponseEntity<Void> deleteComment(@PathVariable("commentId") int commentId) {
        commentService.deleteComment(commentId);
        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }
}
