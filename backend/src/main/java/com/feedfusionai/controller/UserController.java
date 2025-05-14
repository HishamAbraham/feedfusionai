package com.feedfusionai.controller;

import com.feedfusionai.model.LoginRequest;
import com.feedfusionai.model.User;
import com.feedfusionai.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Optional;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;

import java.util.Date;
import java.util.Map;
import javax.crypto.SecretKey;
import javax.crypto.spec.SecretKeySpec;
import java.util.Base64;
import org.springframework.beans.factory.annotation.Value;

@RestController
@RequestMapping("/api/users")
public class UserController {

    private final UserService userService;
    private final SecretKey secretKey;

    @Autowired
    public UserController(UserService userService, @Value("${jwt.secret}") String base64Secret) {
        this.userService = userService;
        final byte[] decodedKey = Base64.getDecoder().decode(base64Secret);
        this.secretKey = new SecretKeySpec(decodedKey, 0, decodedKey.length, "HmacSHA256");
    }

    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody User user) {
        try {
            return ResponseEntity.ok(userService.registerUser(user));
        } catch (IllegalArgumentException ex) {
            return ResponseEntity.badRequest().body(Map.of("error", ex.getMessage()));
        }
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest request) {
        final Optional<User> userOpt = userService.login(request.getEmail(), request.getPassword());
        if (userOpt.isPresent()) {
            final User user = userOpt.get();
            final String token = Jwts.builder()
                    .setSubject(user.getId())
                    .setIssuedAt(new Date())
                    .setExpiration(new Date(System.currentTimeMillis() + 86400000)) // 1 day expiry
                    .signWith(secretKey)
                    .compact();
            return ResponseEntity.ok().body(Map.of("token", token));
        }
        return ResponseEntity.status(401).build();
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteUser(@PathVariable String id) {
        userService.deleteUserById(id);
        return ResponseEntity.noContent().build();
    }
}
