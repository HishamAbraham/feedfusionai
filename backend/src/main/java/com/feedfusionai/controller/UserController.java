package com.feedfusionai.controller;

import com.feedfusionai.model.LoginRequest;
import com.feedfusionai.model.User;
import com.feedfusionai.service.UserService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import io.jsonwebtoken.Jwts;

import java.util.Date;
import java.util.Map;
import javax.crypto.SecretKey;
import org.springframework.beans.factory.annotation.Value;
import java.util.Base64;
import javax.crypto.spec.SecretKeySpec;

@RestController
@RequestMapping("/api/users")
public class UserController {

    private final UserService userService;
    private final SecretKey secretKey;

    public UserController(UserService userService, @Value("${jwt.secret}") String base64Secret) {
        this.userService = userService;
        final byte[] decodedKey = Base64.getDecoder().decode(base64Secret);
        this.secretKey = new SecretKeySpec(decodedKey, 0, decodedKey.length, "HmacSHA256");
    }

    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody User user) {
        ResponseEntity<?> response;
        try {
            response = ResponseEntity.ok(userService.registerUser(user));
        } catch (IllegalArgumentException ex) {
            response = ResponseEntity.badRequest().body(Map.of("error", ex.getMessage()));
        }
        return response;
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest request) {
        ResponseEntity<?> response;
        final var userOpt = userService.login(request.getEmail(), request.getPassword());
        if (userOpt.isPresent()) {
            final User user = userOpt.get();
            final String token = Jwts.builder()
                    .setSubject(user.getId())
                    .setIssuedAt(new Date())
                    .setExpiration(new Date(System.currentTimeMillis() + 86_400_000)) // 1 day expiry
                    .signWith(secretKey)
                    .compact();
            response = ResponseEntity.ok().body(Map.of("token", token));
        } else {
            response = ResponseEntity.status(401).build();
        }
        return response;
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteUser(@PathVariable String id) {
        userService.deleteUserById(id);
        return ResponseEntity.noContent().build();
    }
}
