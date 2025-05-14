package com.feedfusionai.service;
import com.feedfusionai.model.FeedItem;
import com.feedfusionai.repository.FeedItemRepository;
import org.jsoup.Jsoup;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import reactor.core.publisher.Mono;

import java.util.List;
import java.util.Optional;
import java.util.Arrays;

@Service
public class FeedItemService {

    @Autowired
    private FeedItemRepository feedItemRepository;

    @Autowired
    private AiService aiService;

    // Retrieve all feed items
    public List<FeedItem> getAllFeedItems(String userId) {
        return feedItemRepository.findAll();
    }

    // Retrieve a feed item by its ID
    public Optional<FeedItem> getFeedItemById(String id, String userId) {
        return feedItemRepository.findById(id);
    }

    public List<FeedItem> getUnreadFeedItem(String userId) {
        return feedItemRepository.findByReadFalse();
    }

    public List<FeedItem> getStaredFeedItem(String userId) {
        return feedItemRepository.findByStarredTrue();
    }

    // Retrieve all feed items for a given feed
    public List<FeedItem> getFeedItemsByFeedId(String feedId, String userId) {
        return feedItemRepository.findByFeedId(feedId);
    }

    public List<FeedItem> getUnreadFeedItemsByFeedId(String feedId, String userId) {
        return feedItemRepository.findByFeedIdAndReadFalse(feedId);
    }

    public List<FeedItem> getStaredFeedItemsByFeedId(String feedId, String userId) {
        return feedItemRepository.findByFeedIdAndStarredTrue(feedId);
    }


    public Optional<FeedItem> findByFeedLink(String link) {
        return feedItemRepository.findByFeedLink(link);
    }

    // Save a new feed item
    public FeedItem addFeedItem(FeedItem feedItem) {
        return feedItemRepository.save(feedItem);
    }

    // Update an existing feed item (complete update)
    public Optional<FeedItem> updateFeedItem(String id, FeedItem updatedFeedItem) {
        return feedItemRepository.findById(id).map(existingItem -> {
            existingItem.setTitle(updatedFeedItem.getTitle());
            existingItem.setFeedLink(updatedFeedItem.getFeedLink());
            existingItem.setPublishedDate(updatedFeedItem.getPublishedDate());
            existingItem.setRead(updatedFeedItem.getRead());
            // Add or update additional fields as necessary
            return feedItemRepository.save(existingItem);
        });
    }

    public Optional<FeedItem> markFeedRead(String id, String userId) {
        return feedItemRepository.findById(id).map(existingItem -> {
            existingItem.setRead(true);
            // Add or update additional fields as necessary
            return feedItemRepository.save(existingItem);
        });
    }

    public Optional<FeedItem> toggleFeedIemStar(String id, String userId) {
        return feedItemRepository.findById(id).map(existingItem -> {
            existingItem.setStarred(!existingItem.isStarred());
            // Add or update additional fields as necessary
            return feedItemRepository.save(existingItem);
        });
    }

    // Delete a feed item by its ID
    public void deleteFeedItem(String id) {
        feedItemRepository.deleteById(id);
    }

    public reactor.core.publisher.Mono<org.springframework.http.ResponseEntity<String>> resummarizeFeedItem(String id, String userId) {
        // Implementation stub for consistency; actual implementation may vary
        return Mono.just(org.springframework.http.ResponseEntity.ok("Resummarize feature not implemented yet"));
    }

    public reactor.core.publisher.Mono<org.springframework.http.ResponseEntity<List<String>>> retagFeedItem(String id, String userId) {
        // Implementation stub for consistency; actual implementation may vary
        return Mono.just(org.springframework.http.ResponseEntity.ok(List.of()));
    }
}