package com.feedfusionai.model;

import lombok.Data;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.Id;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.Instant;
import java.util.Set;

@Data
@Document(collection = "users")
public class User {
    @Id
    private String id;

    private String email;
    private String displayName;
    private String password; // Hashed
    private Set<String> roles; // e.g., "USER", "ADMIN"
    private String apiKey;
    @CreatedDate
    private Instant createdAt;

    @LastModifiedDate
    private Instant updatedAt;
}