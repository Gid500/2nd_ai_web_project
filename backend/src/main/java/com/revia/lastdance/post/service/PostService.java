package com.revia.lastdance.post.service;

import com.revia.lastdance.post.dao.PostMapper;
import com.revia.lastdance.post.vo.PostVO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder; // Added import
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class PostService {

    @Autowired
    private PostMapper postMapper;

    @Autowired
    private BCryptPasswordEncoder bCryptPasswordEncoder; // Added field

    public List<PostVO> getAllPosts() {
        return postMapper.selectAllPosts();
    }

    public PostVO getPostById(int postId) {
        return postMapper.selectPostById(postId);
    }

    public void createPost(PostVO postVO) {
        if (postVO.getAnoyUserPwd() != null && !postVO.getAnoyUserPwd().isEmpty()) {
            postVO.setAnoyUserPwd(bCryptPasswordEncoder.encode(postVO.getAnoyUserPwd()));
            // For anonymous posts, ensure userId and createdId are null
            postVO.setUserId(null); 
            postVO.setCreatedId(null);
        }
        postMapper.insertPost(postVO);
    }

    public void updatePost(PostVO postVO) {
        postMapper.updatePost(postVO);
    }

    public void deletePost(int postId) {
        postMapper.deletePost(postId);
    }
}