package com.revia.lastdance.post.service;

import com.revia.lastdance.post.dao.PostMapper;
import com.revia.lastdance.post.vo.PostVO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class PostService {

    @Autowired
    private PostMapper postMapper;

    public List<PostVO> getAllPosts() {
        return postMapper.selectAllPosts();
    }

    public PostVO getPostById(int postId) {
        return postMapper.selectPostById(postId);
    }

    public void createPost(PostVO postVO) {
        postMapper.insertPost(postVO);
    }

    public void updatePost(PostVO postVO) {
        postMapper.updatePost(postVO);
    }

    public void deletePost(int postId) {
        postMapper.deletePost(postId);
    }
}