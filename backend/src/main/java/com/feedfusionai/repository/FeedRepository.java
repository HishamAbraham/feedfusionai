package com.feedfusionai.repository;

import com.feedfusionai.model.Feed;
import org.springframework.data.mongodb.repository.MongoRepository;

public interface FeedRepository extends MongoRepository<Feed, String> {
    // Additional custom query methods can be defined here if needed
}