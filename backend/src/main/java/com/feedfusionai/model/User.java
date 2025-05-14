package com.feedfusionai.model;

import edu.umd.cs.findbugs.annotations.SuppressFBWarnings;
import lombok.Data;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.Id;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.Instant;
import java.util.Set;

@Data
@Document(collection = "users")
@SuppressFBWarnings("EI2")
public class User {
    @Id
    private String id;

    private String email;
    private String displayName;
    private String password; // Hashed
    @SuppressFBWarnings(value = {"EI_EXPOSE_REP", "EI_EXPOSE_REP2"},
            justification = "roles list is not mutated externally in this context")
    private Set<String> roles; // e.g., "USER", "ADMIN"
    private String apiKey;
    @CreatedDate
    private Instant createdAt;

    @LastModifiedDate
    private Instant updatedAt;
}