package com.revia.lastdance.login.service;

import com.revia.lastdance.login.dao.LoginMapper;
import com.revia.lastdance.signup.vo.UserVO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.util.ArrayList;

@Service
public class CustomUserDetailsService implements UserDetailsService {

    @Autowired
    private LoginMapper loginMapper;

    @Override
    public UserDetails loadUserByUsername(String identifier) throws UsernameNotFoundException {
        UserVO userVO = loginMapper.findUserByEmailOrUserId(identifier);

        if (userVO == null) {
            throw new UsernameNotFoundException("User not found with identifier: " + identifier);
        }

        // 여기서는 간단하게 UserDetails를 구현한 Spring Security의 User 객체를 반환합니다.
        // 실제 애플리케이션에서는 UserVO의 권한(roles) 정보를 기반으로 GrantedAuthority를 생성해야 합니다.
        return new org.springframework.security.core.userdetails.User(
                userVO.getUserId(), // 또는 userVO.getUserEmail()
                userVO.getUserPwd(),
                new ArrayList<>() // 권한 목록 (예: new SimpleGrantedAuthority("ROLE_USER"))
        );
    }
}
