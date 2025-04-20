package com.feedfusionai.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Profile;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.web.SecurityFilterChain;

@Configuration
@Profile("prod")
public class ProductionSecurityConfig {

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
                // Public endpoints (if any) remain open; everything else requires auth
                .authorizeHttpRequests(auth -> auth
                        .requestMatchers("/api/public/**").permitAll()
                        .anyRequest().authenticated()
                )
                // Apply default CSRF protection
                .csrf(Customizer.withDefaults())
                // Use HTTP Basic auth (or swap in formLogin()/oauth2Login() here)
                .httpBasic(Customizer.withDefaults());

        return http.build();
    }
}