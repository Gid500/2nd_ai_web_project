package com.revia.lastdance.post.service;

import com.revia.lastdance.post.dao.PostMapper;
import com.revia.lastdance.post.vo.PostVO;
import com.revia.lastdance.report.service.ReportService; // ReportService 임포트
import com.revia.lastdance.signin.dto.CustomUserDetails;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.security.Principal;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Objects;

@Service
@RequiredArgsConstructor
public class PostService {

    private static final Logger logger = LoggerFactory.getLogger(PostService.class);

    private final PostMapper postMapper;
    private final FileService fileService; // FileService 주입
    private final PasswordEncoder passwordEncoder;
    private final ReportService reportService; // ReportService 주입

    public Map<String, Object> getAllPosts(int page, int size) {
        int offset = (page - 1) * size;
        List<PostVO> posts = postMapper.selectAllGeneralPostsPaged(size, offset); // 일반 게시물만 조회
        int totalPosts = postMapper.countAllGeneralPosts(); // 일반 게시물만 카운트

        Map<String, Object> response = new HashMap<>();
        response.put("posts", posts);
        response.put("totalPosts", totalPosts);
        response.put("currentPage", page);
        response.put("pageSize", size);
        response.put("totalPages", (int) Math.ceil((double) totalPosts / size));
        return response;
    }

    public List<PostVO> getTopNotices(int count) {
        return postMapper.selectTopNotices(count);
    }

    @Transactional
    public PostVO getPostById(int postId) {
        postMapper.incrementPostViewCunt(postId); // 조회수 증가
        return postMapper.selectPostById(postId);
    }

    public void createPost(PostVO postVO, List<MultipartFile> files, Principal principal) {
        Authentication authentication = (Authentication) principal;
        CustomUserDetails userDetails = (CustomUserDetails) authentication.getPrincipal();
        String userId = userDetails.getUserId();

        // 공지사항 작성 권한 검사 (isAdmin 사용하지 않으므로 제거했던 부분 복구)
        if (postVO.getIsNotice() != null && postVO.getIsNotice()) {
            boolean isAdmin = authentication.getAuthorities().stream()
                                        .anyMatch(a -> a.getAuthority().equals("ROLE_ADMIN") || a.getAuthority().equals("ROLE_admin"));
            if (!isAdmin) {
                throw new AccessDeniedException("공지사항은 관리자만 작성할 수 있습니다.");
            }
        }

        postVO.setUserId(userId);
        postVO.setCreatedId(userId);
        postVO.setUpdatedId(userId);

        postMapper.insertPost(postVO); // 게시물 먼저 저장하여 postId를 얻음

        // 파일 저장 (이미지)
        if (postVO.getPostId() > 0) { // 게시물이 성공적으로 저장되었는지 확인
            fileService.uploadFiles(postVO.getPostId(), files);
        }
    }

    public void updatePost(PostVO postVO, List<MultipartFile> files) {
        // 1. 게시물 정보 업데이트
        postMapper.updatePost(postVO);

        // 2. 삭제할 파일 처리
        if (postVO.getDeletedFileIds() != null && !postVO.getDeletedFileIds().isEmpty()) {
            for (Integer fileId : postVO.getDeletedFileIds()) {
                fileService.deleteFile(fileId);
            }
        }

        // 3. 새 파일 저장
        fileService.uploadFiles(postVO.getPostId(), files);
    }

    public void deletePost(int postId) {
        // 게시물 삭제 전에 연결된 파일 정보도 삭제
        fileService.deleteFilesByPostId(postId);
        reportService.updateReportsStatusByReportedPostId(postId, 3); // 게시물에 연결된 신고 상태를 '게시물 삭제됨'으로 업데이트 (3은 예시 상태 코드)
        postMapper.deletePost(postId);
    }

    public boolean isOwner(int postId, String userId) {
        PostVO post = postMapper.selectPostById(postId);
        if (post == null) {
            logger.warn("Post with ID {} not found.", postId);
            return false;
        }
        logger.info("Checking ownership: Post ID = {}, Stored User ID = {}, Current User ID = {}", postId, post.getUserId(), userId);
        return Objects.equals(post.getUserId(), userId);
    }

    public Map<String, Object> searchPosts(String searchType, String searchKeyword, int page, int size) {
        int offset = (page - 1) * size;
        List<PostVO> posts = postMapper.searchPosts(searchType, searchKeyword, size, offset);
        int totalPosts = postMapper.countSearchPosts(searchType, searchKeyword);

        Map<String, Object> response = new HashMap<>();
        response.put("posts", posts);
        response.put("totalPosts", totalPosts);
        response.put("currentPage", page);
        response.put("pageSize", size);
        response.put("totalPages", (int) Math.ceil((double) totalPosts / size));
        return response;
    }
}