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
import com.revia.lastdance.signin.dto.CustomUserDetails;

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
            return new ResponseEntity<String>("로그인이 필요합니다.", HttpStatus.UNAUTHORIZED);
        }
        // 현재 로그인한 사용자의 ID를 commentVO에 설정
        Object principal = authentication.getPrincipal();
        String currentUserId;
        if (principal instanceof CustomUserDetails) {
            currentUserId = ((CustomUserDetails) principal).getUserId(); // CustomUserDetails에서 userId 가져오기
        } else if (principal instanceof UserDetails) {
            currentUserId = ((UserDetails) principal).getUsername(); // 기본 UserDetails의 경우 username 사용
        } else {
            return new ResponseEntity<>("사용자 정보를 찾을 수 없습니다.", HttpStatus.INTERNAL_SERVER_ERROR);
        }
        commentVO.setUserId(currentUserId);

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
        Object principal = authentication.getPrincipal();
        String currentUserId;
        if (principal instanceof CustomUserDetails) {
            currentUserId = ((CustomUserDetails) principal).getUserId(); // CustomUserDetails에서 userId 가져오기
        } else if (principal instanceof UserDetails) {
            currentUserId = ((UserDetails) principal).getUsername(); // 기본 UserDetails의 경우 username 사용
        } else {
            return new ResponseEntity<>("사용자 정보를 찾을 수 없습니다.", HttpStatus.INTERNAL_SERVER_ERROR);
        }

        CommentVO existingComment = commentService.getCommentById(commentId);
        if (existingComment == null) {
            return new ResponseEntity<>("댓글을 찾을 수 없습니다.", HttpStatus.NOT_FOUND);
        }
        if (!existingComment.getUserId().equals(currentUserId)) { // String 비교는 equals 사용
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

        Object principal = authentication.getPrincipal();
        String currentUserId;
        if (principal instanceof CustomUserDetails) {
            currentUserId = ((CustomUserDetails) principal).getUserId(); // CustomUserDetails에서 userId 가져오기
        } else if (principal instanceof UserDetails) {
            currentUserId = ((UserDetails) principal).getUsername(); // 기본 UserDetails의 경우 username 사용
        } else {
            return new ResponseEntity<>("사용자 정보를 찾을 수 없습니다.", HttpStatus.INTERNAL_SERVER_ERROR);
        }
        boolean isAdmin = authentication.getAuthorities().stream()
                .anyMatch(r -> r.getAuthority().toUpperCase().equals("ROLE_ADMIN")); // 대소문자 구분 없이 비교

        try {
            commentService.deleteComment(commentId, currentUserId, isAdmin);
            return new ResponseEntity<>("댓글이 성공적으로 삭제되었습니다.", HttpStatus.OK);
        } catch (AccessDeniedException e) {
            return new ResponseEntity<>(e.getMessage(), HttpStatus.FORBIDDEN);
        } catch (IllegalArgumentException e) {
            return new ResponseEntity<>(e.getMessage(), HttpStatus.NOT_FOUND);
        }
    }

    // 관리자용: 모든 댓글 조회
    @GetMapping("/admin/all")
    public ResponseEntity<List<CommentVO>> getAllCommentsForAdmin() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || !authentication.isAuthenticated()) {
            return new ResponseEntity<>(java.util.Collections.emptyList(), HttpStatus.UNAUTHORIZED);
        }

        boolean isAdmin = authentication.getAuthorities().stream()
                .anyMatch(r -> r.getAuthority().toUpperCase().equals("ROLE_ADMIN"));

        if (!isAdmin) {
            return new ResponseEntity<>(java.util.Collections.emptyList(), HttpStatus.FORBIDDEN);
        }

        List<CommentVO> allComments = commentService.getAllComments();
        return new ResponseEntity<>(allComments, HttpStatus.OK);
    }
}