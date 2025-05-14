package com.feedfusionai.controller;

import com.feedfusionai.model.Feed;
import com.feedfusionai.service.FeedScannerService;
import com.feedfusionai.service.FeedService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.security.core.context.SecurityContextHolder;

@RestController
@RequestMapping("/api/feeds")
public class FeedController {

    private static final Logger LOGGER = LoggerFactory.getLogger(FeedController.class);

    @Autowired
    private FeedService feedService;

    @Autowired
    private FeedScannerService feedScannerService;

    // GET /api/feeds - Retrieve all feeds
    @GetMapping
    public List<Feed> getAllFeeds() {
        final String userId = (String) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        LOGGER.debug("Getting all feeds for user {}", userId);
        return feedService.getFeedsByUser(userId);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Feed> getFeedById(@PathVariable String id) {
        final String userId = (String) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        LOGGER.debug("Getting feed for id {} and user {}", id, userId);
        return feedService.getFeedById(id, userId)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<Feed> createFeed(@RequestBody Feed feed) {
        final String userId = (String) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        feed.setOwnerId(userId);
        final Feed created = feedService.addFeed(feed, userId);
        return ResponseEntity.status(HttpStatus.CREATED).body(created);
    }

    @PatchMapping("/{id}")
    public ResponseEntity<Feed> patchFeed(@PathVariable String id, @RequestBody Map<String, Object> updates) {
        final String userId = (String) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        LOGGER.debug("Patching feed id {} for user {} with {}", id, userId, updates);
        return feedService.patchFeed(id, userId, updates)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteFeed(@PathVariable String id) {
        final String userId = (String) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        LOGGER.debug("Deleting feed id {} for user {}", id, userId);
        feedService.deleteFeed(id, userId);
        return ResponseEntity.noContent().build();
    }

    @PatchMapping("/refresh")
    public ResponseEntity<Integer> refreshFeeds() {
        final String userId = (String) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        final int added = feedScannerService.scanFeeds(Optional.of(userId));
        return ResponseEntity.ok(added);
    }
}