package com.revia.lastdance.post.dao;

import com.revia.lastdance.post.vo.PostVO;
import org.apache.ibatis.annotations.Mapper;

import java.util.List;

@Mapper
public interface PostMapper {
    List<PostVO> selectAllPosts();
    PostVO selectPostById(int postId);
    void insertPost(PostVO postVO);
    void updatePost(PostVO postVO);
    void deletePost(int postId);
}
