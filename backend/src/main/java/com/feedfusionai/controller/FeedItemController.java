package com.feedfusionai.controller;

import com.feedfusionai.model.FeedItem;
import com.feedfusionai.repository.FeedItemRepository;
import com.feedfusionai.service.FeedItemService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/feed-items")
public class FeedItemController {

    @Autowired
    private FeedItemService feedItemService;

    // GET /api/feed-items - Retrieve all feed items
    @GetMapping
    public List<FeedItem> getAllFeedItems() {
        return feedItemService.getAllFeedItems();
    }

    @GetMapping("unread")
    public List<FeedItem> getUnreadFeedItems() {
        return feedItemService.getUnreadFeedItem();
    }


    // GET /api/feed-items/{id} - Retrieve a feed item by ID
    @GetMapping("/{id}")
    public ResponseEntity<FeedItem> getFeedItemById(@PathVariable String id) {
        return feedItemService.getFeedItemById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }



    // GET /api/feed-items/for-feed/{feedId} - Retrieve feed items for a specific feed
    @GetMapping("/for-feed/{feedId}")
    public List<FeedItem> getFeedItemsForFeed(@PathVariable String feedId) {
        return feedItemService.getFeedItemsByFeedId(feedId);
    }

    @GetMapping("/for-feed/{feedId}/unread")
    public List<FeedItem> getUnreadFeedItemsForFeed(@PathVariable String feedId) {
        return feedItemService.getUnreadFeedItemsByFeedId(feedId);
    }

    @PatchMapping("/{id}/toggle")
    public ResponseEntity<FeedItem> toggleReadStatus(@PathVariable String id) {
        return feedItemService.toggleReadStatus(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }
}