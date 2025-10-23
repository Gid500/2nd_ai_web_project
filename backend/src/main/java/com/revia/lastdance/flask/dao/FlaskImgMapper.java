package com.revia.lastdance.flask.dao;

import com.revia.lastdance.flask.vo.FlaskImgVO;
import org.apache.ibatis.annotations.Mapper;

@Mapper
public interface FlaskImgMapper {
    void insertFlaskImg(FlaskImgVO flaskImgVO);
}
