package com.revia.lastdance.signin.service;

import com.revia.lastdance.signin.dao.SigninMapper;
import com.revia.lastdance.signin.dto.CustomUserDetails;
import com.revia.lastdance.signup.vo.UserVO;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.util.Collections;

@Service
@RequiredArgsConstructor
public class UserDetailsServiceImpl implements UserDetailsService {

    private final SigninMapper signinMapper;

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        UserVO userVO = signinMapper.findUserByEmailOrUserId(username);
        if (userVO == null) {
            throw new UsernameNotFoundException("User not found with identifier: " + username);
        }
        // Ensure roleType is prefixed with 'ROLE_' for Spring Security
        String role = userVO.getRoleType().startsWith("ROLE_") ? userVO.getRoleType() : "ROLE_" + userVO.getRoleType();
        return new CustomUserDetails(userVO.getUserEmail(), userVO.getUserPwd(), Collections.singletonList(new SimpleGrantedAuthority(role)), userVO.getUserId());
    }
}
