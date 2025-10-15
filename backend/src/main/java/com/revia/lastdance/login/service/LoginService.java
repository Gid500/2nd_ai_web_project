package com.revia.lastdance.login.service;

import com.revia.lastdance.login.dao.LoginMapper;
import com.revia.lastdance.signup.vo.UserVO;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import jakarta.servlet.http.HttpSession;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class LoginService {

    private final LoginMapper loginMapper;

    @Transactional
    public boolean login(String identifier, String password, HttpSession session) {
        UserVO user = loginMapper.findUserByEmailOrUserId(identifier);

        if (user != null && user.getUserPwd().equals(password)) {
            session.setAttribute("userId", user.getUserId());
            return true;
        } else {
            return false;
        }
    }
}
