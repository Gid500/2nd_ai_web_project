package com.revia.lastdance.login.service;

import com.revia.lastdance.login.dao.LoginMapper;
import com.revia.lastdance.signup.vo.UserVO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder; // PasswordEncoder import 추가
import org.springframework.stereotype.Service;

@Service
public class LoginService {

    @Autowired
    private LoginMapper loginMapper;

    @Autowired
    private PasswordEncoder passwordEncoder; // PasswordEncoder 주입

    public UserVO login(String identifier, String password) {
        System.out.println("LoginService: Attempting login for identifier: " + identifier);
        System.out.println("LoginService: Received password: " + password);

        UserVO user = loginMapper.findUserByEmailOrUserId(identifier);

        if (user == null) {
            System.out.println("LoginService: User not found for identifier: " + identifier);
            return null;
        }

        System.out.println("LoginService: User found: " + user.getUserId());
        // 비밀번호는 암호화되어 저장되므로 직접 출력하지 않음

        if (passwordEncoder.matches(password, user.getUserPwd())) { // 암호화된 비밀번호 비교
            System.out.println("LoginService: Password match successful.");
            return user;
        } else {
            System.out.println("LoginService: Password mismatch.");
            return null;
        }
    }
}
