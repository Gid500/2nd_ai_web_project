package com.revia.lastdance.post.dao;

import com.revia.lastdance.post.vo.PostVO;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;

@Mapper
public interface PostMapper {
    List<PostVO> selectAllPostsPaged(@Param("size") int size, @Param("offset") int offset);
    int countAllPosts();
    PostVO selectPostById(int postId);
    void insertPost(PostVO postVO);
    void updatePost(PostVO postVO);
    void deletePost(int postId);
}
