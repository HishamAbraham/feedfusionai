package com.feedfusionai.model;

import edu.umd.cs.findbugs.annotations.SuppressFBWarnings;

import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.Instant;
import java.util.List;

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
    private Boolean read;
    private boolean starred;
    private String summary;
    @SuppressFBWarnings(value = {"EI_EXPOSE_REP", "EI_EXPOSE_REP2"},
            justification = "tags list is not mutated externally in this context")
    private List<String> tags;
}