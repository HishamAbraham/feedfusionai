package com.feedfusionai.controller;

import org.springframework.security.core.context.SecurityContextHolder;

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

    private static final Logger LOGGER = LoggerFactory.getLogger(FeedItemController.class);

    @Autowired
    private FeedItemService feedItemService;

    // GET /api/feed-items - Retrieve all feed items
    @GetMapping
    public List<FeedItem> getAllFeedItems() {
        final String userId = (String) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        LOGGER.debug("Getting all feed items for user {}", userId);
        return feedItemService.getAllFeedItems(userId);
    }

    @GetMapping("unread")
    public List<FeedItem> getUnreadFeedItems() {
        final String userId = (String) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        LOGGER.debug("Getting all unread feed items for user {}", userId);
        return feedItemService.getUnreadFeedItem(userId);
    }

    @GetMapping("starred")
    public List<FeedItem> getStaredFeedItems() {
        final String userId = (String) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        LOGGER.debug("Getting all starred feed items for user {}", userId);
        return feedItemService.getStaredFeedItem(userId);
    }

    @GetMapping("/{id}")
    public ResponseEntity<FeedItem> getFeedItemById(@PathVariable String id) {
        final String userId = (String) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        LOGGER.debug("Getting feed item for feed item ID {} and user {}", id, userId);
        return feedItemService.getFeedItemById(id, userId)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }



    // GET /api/feed-items/for-feed/{feedId} - Retrieve feed items for a specific feed
    @GetMapping("/for-feed/{feedId}")
    public List<FeedItem> getFeedItemsForFeed(@PathVariable String feedId) {
        final String userId = (String) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        LOGGER.debug("Getting feed items for feed ID {} and user {}", feedId, userId);
        return feedItemService.getFeedItemsByFeedId(feedId, userId);
    }

    @GetMapping("/for-feed/{feedId}/unread")
    public List<FeedItem> getUnreadFeedItemsForFeed(@PathVariable String feedId) {
        final String userId = (String) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        LOGGER.debug("Getting Unread feed items for feed ID {} and user {}", feedId, userId);
        return feedItemService.getUnreadFeedItemsByFeedId(feedId, userId);
    }

    @GetMapping("/for-feed/{feedId}/starred")
    public List<FeedItem> getStaredFeedItemsForFeed(@PathVariable String feedId) {
        final String userId = (String) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        LOGGER.debug("Getting starred feed items for feed ID {} and user {}", feedId, userId);
        return feedItemService.getStaredFeedItemsByFeedId(feedId, userId);
    }

    @PatchMapping("/{id}/mark-read")
    public ResponseEntity<FeedItem> markFeedRead(@PathVariable String id) {
        final String userId = (String) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        LOGGER.debug("Marking feed item {} as read for user {}", id, userId);
        return feedItemService.markFeedRead(id, userId)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PatchMapping("/{id}/toggle-star")
    public ResponseEntity<FeedItem> toggleFeedIemStar(@PathVariable String id) {
        final String userId = (String) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        LOGGER.debug("Toggling star for feed item {} for user {}", id, userId);
        return feedItemService.toggleFeedIemStar(id, userId)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PatchMapping("/{id}/resummarize")
    public reactor.core.publisher.Mono<ResponseEntity<String>> resummarizeFeedItem(@PathVariable String id) {
        final String userId = (String) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        LOGGER.debug("Resummarizing feed item {} for user {}", id, userId);
        return feedItemService.resummarizeFeedItem(id, userId)
                .defaultIfEmpty(ResponseEntity.notFound().build());
    }

    @PatchMapping("/{id}/retag")
    public reactor.core.publisher.Mono<ResponseEntity<List<String>>> retagFeedItem(@PathVariable String id) {
        final String userId = (String) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        LOGGER.debug("Retagging feed item {} for user {}", id, userId);
        return feedItemService.retagFeedItem(id, userId)
                .defaultIfEmpty(ResponseEntity.notFound().build());
    }


}