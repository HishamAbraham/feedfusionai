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

    // Reference to the parent feed's ID
    private String feedId;

    private String title;
    private String feedLink;
    private Instant publishedDate;

    // New fields for additional content
    private String description;
}