package com.revia.lastdance.signin.service;

import com.revia.lastdance.signin.dao.SigninMapper;
import com.revia.lastdance.signin.dto.CustomUserDetails;
import com.revia.lastdance.signup.vo.UserVO;
import com.revia.lastdance.user.vo.AdminUserVO;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.util.Collections;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class UserDetailsServiceImpl implements UserDetailsService {

    private final SigninMapper signinMapper;

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        UserVO userVO = signinMapper.findByUserIdOrEmail(username);
        if (userVO == null) {
            throw new UsernameNotFoundException("User not found with identifier: " + username);
        }
        // Ensure roleType is prefixed with 'ROLE_' for Spring Security
        String role = userVO.getRoleType().startsWith("ROLE_") ? userVO.getRoleType() : "ROLE_" + userVO.getRoleType();
        return new CustomUserDetails(userVO.getUserEmail(), userVO.getUserPwd(), Collections.singletonList(new SimpleGrantedAuthority(role)), userVO.getUserId());
    }

    public Map<String, Object> getAllUsers(int page, int limit) {
        int offset = (page - 1) * limit;
        List<AdminUserVO> users = signinMapper.selectPagedAdminUsers(offset, limit);
        int totalUsers = signinMapper.countAllAdminUsers();

        users.forEach(user -> {
            int reportCount = signinMapper.getReportCountByUserId(user.getUserId());
            user.setReportCount(reportCount);
        });

        Map<String, Object> result = new HashMap<>();
        result.put("users", users);
        result.put("totalUsers", totalUsers);
        return result;
    }
}

