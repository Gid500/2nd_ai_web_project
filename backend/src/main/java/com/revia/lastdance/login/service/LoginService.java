package com.revia.lastdance.login.service;

import com.revia.lastdance.login.dao.LoginMapper;
import com.revia.lastdance.signup.vo.UserVO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class LoginService {

    @Autowired
    private LoginMapper loginMapper;

    public UserVO login(String identifier, String password) {
        System.out.println("LoginService: Attempting login for identifier: " + identifier);
        System.out.println("LoginService: Received password: " + password);

        UserVO user = loginMapper.findUserByEmailOrUserId(identifier);

        if (user == null) {
            System.out.println("LoginService: User not found for identifier: " + identifier);
            return null;
        }

        System.out.println("LoginService: User found: " + user.getUserId());
        System.out.println("LoginService: Stored password: " + user.getUserPwd());

        if (user.getUserPwd().equals(password)) {
            System.out.println("LoginService: Password match successful.");
            return user;
        } else {
            System.out.println("LoginService: Password mismatch.");
            return null;
        }
    }
}
