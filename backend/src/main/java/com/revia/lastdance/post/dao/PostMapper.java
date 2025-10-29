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
    void incrementPostViewCunt(int postId); // 조회수 증가 메서드 추가

    // New methods for notices and general posts
    List<PostVO> selectTopNotices(@Param("count") int count);
    List<PostVO> selectAllGeneralPostsPaged(@Param("size") int size, @Param("offset") int offset);
    int countAllGeneralPosts();

    // New methods for searching posts
    List<PostVO> searchPosts(@Param("searchType") String searchType, @Param("searchKeyword") String searchKeyword, @Param("size") int size, @Param("offset") int offset);
    int countSearchPosts(@Param("searchType") String searchType, @Param("searchKeyword") String searchKeyword);
}
