package com.feedfusionai.repository;

import com.feedfusionai.model.Feed;
import org.springframework.data.mongodb.repository.MongoRepository;
import java.util.List;
import java.util.Optional;

public interface FeedRepository extends MongoRepository<Feed, String> {
    List<Feed> findByOwnerId(String ownerId);
    Optional<Feed> findByIdAndOwnerId(String id, String ownerId);
}