package com.revia.lastdance.login.util;

import com.auth0.jwt.JWT;
import com.auth0.jwt.algorithms.Algorithm;
import com.auth0.jwt.exceptions.JWTVerificationException;
import com.auth0.jwt.interfaces.DecodedJWT;
import com.revia.lastdance.config.JwtProperties;
import org.springframework.stereotype.Component;

import java.util.Date;

@Component
public class JwtUtil {

    private final String secret;
    private final Long expiration;

    public JwtUtil(JwtProperties jwtProperties) {
        this.secret = jwtProperties.getSecret();
        this.expiration = jwtProperties.getExpiration();
    }

    // JWT 토큰 생성
    public String generateToken(String userId) {
        Date now = new Date();
        Date expiryDate = new Date(now.getTime() + expiration);

        return JWT.create()
                .withSubject(userId)
                .withIssuedAt(now)
                .withExpiresAt(expiryDate)
                .sign(Algorithm.HMAC512(secret));
    }

    // JWT 토큰 유효성 검증 및 정보 추출
    public String validateTokenAndRetrieveSubject(String token) throws JWTVerificationException {
        DecodedJWT jwt = JWT.require(Algorithm.HMAC512(secret))
                .build()
                .verify(token);
        return jwt.getSubject();
    }
}
