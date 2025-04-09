package com.feedfusionai.repository;

import com.feedfusionai.model.FeedItem;
import org.springframework.data.mongodb.repository.MongoRepository;
import java.util.List;
import java.util.Optional;

public interface FeedItemRepository extends MongoRepository<FeedItem, String> {
    List<FeedItem> findByFeedId(String feedId);
    List<FeedItem> findByFeedIdAndReadFalse(String feedId);
    Optional<FeedItem> findByFeedLink(String link);
    List<FeedItem> findByReadFalse();

}