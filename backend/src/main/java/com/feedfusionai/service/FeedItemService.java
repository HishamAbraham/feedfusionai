package com.feedfusionai.service;

import com.feedfusionai.model.FeedItem;
import com.feedfusionai.repository.FeedItemRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class FeedItemService {

    @Autowired
    private FeedItemRepository feedItemRepository;

    // Retrieve all feed items
    public List<FeedItem> getAllFeedItems() {
        return feedItemRepository.findAll();
    }

    // Retrieve a feed item by its ID
    public Optional<FeedItem> getFeedItemById(String id) {
        return feedItemRepository.findById(id);
    }

    // Retrieve all feed items for a given feed
    public List<FeedItem> getFeedItemsByFeedId(String feedId) {
        return feedItemRepository.findByFeedId(feedId);
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
            existingItem.setLink(updatedFeedItem.getLink());
            existingItem.setPublishedDate(updatedFeedItem.getPublishedDate());
            // Add or update additional fields as necessary
            return feedItemRepository.save(existingItem);
        });
    }

    // Delete a feed item by its ID
    public void deleteFeedItem(String id) {
        feedItemRepository.deleteById(id);
    }
}