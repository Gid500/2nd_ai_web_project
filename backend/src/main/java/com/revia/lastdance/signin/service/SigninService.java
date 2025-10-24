package com.revia.lastdance.signin.service;

import com.revia.lastdance.signin.dao.SigninMapper;
import com.revia.lastdance.signup.vo.UserVO;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import jakarta.servlet.http.HttpSession;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class SigninService {

    private final SigninMapper signinMapper;

    @Transactional
    public boolean login(String identifier, String password, HttpSession session) {
        UserVO user = signinMapper.findUserByEmailOrUserId(identifier);

        if (user != null && user.getUserPwd().equals(password)) {
            session.setAttribute("userId", user.getUserId());
            return true;
        } else {
            return false;
        }
    }
}
