package com.feedfusionai.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.annotation.Transient;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;
import java.time.Instant;

@Data
@Document(collection = "feeds")
@NoArgsConstructor
@AllArgsConstructor
public class Feed {
    @Id
    private String id;
    private String title;
    private String description;
    @Indexed(unique = true)
    private String url;
    private String imageUrl;
    private Instant lastFetched;
    @Transient
    private long unreadCount;
}
