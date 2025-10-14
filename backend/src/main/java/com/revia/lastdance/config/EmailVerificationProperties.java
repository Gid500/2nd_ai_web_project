package com.revia.lastdance.config;

import lombok.Data;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.stereotype.Component;

@Data
@Component
@ConfigurationProperties(prefix = "email.verification")
public class EmailVerificationProperties {
    private long expiration;
}
