package com.feedfusionai.model;

import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import java.time.Instant;

@Data
@Document(collection = "feedItems")
public class FeedItem {
    @Id
    private String id;
    private String feedId; // Reference to the parent feed's ID
    private String title;
    private String summary;
    private String content;
    private String link;
    private Instant publishedDate;

    // Additional fields like author, categories, etc.
}