package com.feedfusionai.controller;

import com.feedfusionai.model.FeedItem;
import com.feedfusionai.service.FeedItemService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/feed-items")
public class FeedItemController {

    private static final Logger logger = LoggerFactory.getLogger(FeedItemController.class);

    @Autowired
    private FeedItemService feedItemService;

    // GET /api/feed-items - Retrieve all feed items
    @GetMapping
    public List<FeedItem> getAllFeedItems() {
        logger.debug("Getting all feed items");
        return feedItemService.getAllFeedItems();
    }

    @GetMapping("unread")
    public List<FeedItem> getUnreadFeedItems() {
        logger.debug("Getting all unread feed items");
        return feedItemService.getUnreadFeedItem();
    }

    @GetMapping("starred")
    public List<FeedItem> getStaredFeedItems() {
        logger.debug("Getting all starred feed items");
        return feedItemService.getStaredFeedItem();
    }

    @GetMapping("/{id}")
    public ResponseEntity<FeedItem> getFeedItemById(@PathVariable String id) {
        logger.debug("Getting feed item for feed item ID {}", id);
        return feedItemService.getFeedItemById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }



    // GET /api/feed-items/for-feed/{feedId} - Retrieve feed items for a specific feed
    @GetMapping("/for-feed/{feedId}")
    public List<FeedItem> getFeedItemsForFeed(@PathVariable String feedId) {
        logger.debug("Getting feed items for feed ID {}", feedId);
        return feedItemService.getFeedItemsByFeedId(feedId);
    }

    @GetMapping("/for-feed/{feedId}/unread")
    public List<FeedItem> getUnreadFeedItemsForFeed(@PathVariable String feedId) {
        logger.debug("Getting Unread feed items for feed ID {}", feedId);
        return feedItemService.getUnreadFeedItemsByFeedId(feedId);
    }

    @GetMapping("/for-feed/{feedId}/starred")
    public List<FeedItem> getStaredFeedItemsForFeed(@PathVariable String feedId) {
        logger.debug("Getting starred feed items for feed ID {}", feedId);
        return feedItemService.getStaredFeedItemsByFeedId(feedId);
    }

    @PatchMapping("/{id}/mark-read")
    public ResponseEntity<FeedItem> markFeedRead(@PathVariable String id) {
        logger.debug("Marking feed item {} as read", id);
        return feedItemService.markFeedRead(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PatchMapping("/{id}/toggle-star")
    public ResponseEntity<FeedItem> toggleFeedIemStar(@PathVariable String id) {
        logger.debug("Toggling star for feed item {}", id);
        return feedItemService.toggleFeedIemStar(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }
}