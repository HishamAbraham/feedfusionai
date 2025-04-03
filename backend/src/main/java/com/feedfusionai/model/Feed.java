package com.feedfusionai.model;

import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import java.time.Instant;

@Data
@Document(collection = "feeds")
public class Feed {
    @Id
    private String id;
    private String title;
    private String url;
    private Instant lastFetched;

    // Additional fields, constructors, or methods can be added here
}
