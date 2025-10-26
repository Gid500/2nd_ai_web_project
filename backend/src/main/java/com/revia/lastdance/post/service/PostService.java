package com.revia.lastdance.post.service;

import com.revia.lastdance.post.dao.PostMapper;
import com.revia.lastdance.post.vo.PostVO;
import com.revia.lastdance.signin.dto.CustomUserDetails;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.security.Principal;
import java.util.List;
import java.util.Objects;

@Service
@RequiredArgsConstructor
public class PostService {

    private static final Logger logger = LoggerFactory.getLogger(PostService.class);

    private final PostMapper postMapper;
    private final PasswordEncoder passwordEncoder;

    public List<PostVO> getAllPosts() {
        return postMapper.selectAllPosts();
    }

    public PostVO getPostById(int postId) {
        return postMapper.selectPostById(postId);
    }

    public void createPost(PostVO postVO, Principal principal) {
        Authentication authentication = (Authentication) principal;
        CustomUserDetails userDetails = (CustomUserDetails) authentication.getPrincipal();
        String userId = userDetails.getUserId();

        postVO.setUserId(userId);
        postVO.setCreatedId(userId);
        postVO.setUpdatedId(userId);

        postMapper.insertPost(postVO);
    }

    public void updatePost(PostVO postVO) {
        postMapper.updatePost(postVO);
    }

    public void deletePost(int postId) {
        postMapper.deletePost(postId);
    }

    public boolean isOwner(int postId, String userId) {
        logger.info("Checking ownership for postId: {}, principalUserId: {}", postId, userId);
        PostVO post = postMapper.selectPostById(postId);
        if (post == null) {
            logger.warn("Post with ID {} not found.", postId);
            return false;
        }
        logger.info("Post author userId from DB: {}", post.getUserId());
        return Objects.equals(post.getUserId(), userId);
    }
}