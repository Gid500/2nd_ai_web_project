package com.revia.lastdance.comment.controller;

import com.revia.lastdance.comment.service.CommentService;
import com.revia.lastdance.comment.vo.CommentVO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.access.AccessDeniedException;

import java.util.List;

@RestController
@RequestMapping("/api/comments")
public class CommentController {

    @Autowired
    private CommentService commentService;

    // 댓글 작성
    @PostMapping
    public ResponseEntity<String> addComment(@RequestBody CommentVO commentVO) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || !authentication.isAuthenticated()) {
            return new ResponseEntity<>("로그인이 필요합니다.", HttpStatus.UNAUTHORIZED);
        }
        // 현재 로그인한 사용자의 ID를 commentVO에 설정
        UserDetails userDetails = (UserDetails) authentication.getPrincipal();
        // userDetails에서 userId를 가져오는 로직이 필요합니다. (예: CustomUserDetails 사용)
        // 현재는 임시로 1로 설정합니다. 실제 구현에서는 userDetails에서 userId를 추출해야 합니다.
        // TODO: userDetails에서 userId를 가져오는 로직 구현
        commentVO.setUserId(1); // 임시 userId

        commentService.addComment(commentVO);
        return new ResponseEntity<>("댓글이 성공적으로 작성되었습니다.", HttpStatus.CREATED);
    }

    // 게시글의 댓글 목록 조회
    @GetMapping("/post/{postId}")
    public ResponseEntity<List<CommentVO>> getCommentsByPostId(@PathVariable("postId") int postId) {
        List<CommentVO> comments = commentService.getCommentsByPostId(postId);
        return new ResponseEntity<>(comments, HttpStatus.OK);
    }

    // 댓글 수정
    @PostMapping("/{commentId}") // PUT 대신 POST 사용 (요청에 따라)
    public ResponseEntity<String> updateComment(@PathVariable("commentId") int commentId, @RequestBody CommentVO commentVO) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || !authentication.isAuthenticated()) {
            return new ResponseEntity<>("로그인이 필요합니다.", HttpStatus.UNAUTHORIZED);
        }
        // TODO: userDetails에서 userId를 가져오는 로직 구현
        int currentUserId = 1; // 임시 userId

        CommentVO existingComment = commentService.getCommentById(commentId);
        if (existingComment == null) {
            return new ResponseEntity<>("댓글을 찾을 수 없습니다.", HttpStatus.NOT_FOUND);
        }
        if (existingComment.getUserId() != currentUserId) {
            return new ResponseEntity<>("댓글을 수정할 권한이 없습니다.", HttpStatus.FORBIDDEN);
        }

        commentVO.setCommentId(commentId);
        commentService.updateComment(commentVO);
        return new ResponseEntity<>("댓글이 성공적으로 수정되었습니다.", HttpStatus.OK);
    }

    // 댓글 삭제
    @PostMapping("/delete/{commentId}") // DELETE 대신 POST 사용 (요청에 따라)
    public ResponseEntity<String> deleteComment(@PathVariable("commentId") int commentId) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || !authentication.isAuthenticated()) {
            return new ResponseEntity<>("로그인이 필요합니다.", HttpStatus.UNAUTHORIZED);
        }

        UserDetails userDetails = (UserDetails) authentication.getPrincipal();
        // TODO: userDetails에서 userId를 가져오는 로직 구현
        int currentUserId = 1; // 임시 userId
        boolean isAdmin = authentication.getAuthorities().stream()
                .anyMatch(r -> r.getAuthority().equals("ROLE_ADMIN"));

        try {
            commentService.deleteComment(commentId, currentUserId, isAdmin);
            return new ResponseEntity<>("댓글이 성공적으로 삭제되었습니다.", HttpStatus.OK);
        } catch (AccessDeniedException e) {
            return new ResponseEntity<>(e.getMessage(), HttpStatus.FORBIDDEN);
        } catch (IllegalArgumentException e) {
            return new ResponseEntity<>(e.getMessage(), HttpStatus.NOT_FOUND);
        }
    }
}