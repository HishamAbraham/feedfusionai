package com.feedfusionai.controller;

import com.feedfusionai.model.Feed;
import com.feedfusionai.service.FeedScannerService;
import com.feedfusionai.service.FeedService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Map;
import java.util.concurrent.CompletableFuture;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

@RestController
@RequestMapping("/api/feeds")
public class FeedController {

    private static final Logger logger = LoggerFactory.getLogger(FeedController.class);

    @Autowired
    private FeedService feedService;

    @Autowired
    private FeedScannerService feedScannerService;

    // GET /api/feeds - Retrieve all feeds
    @GetMapping
    public List<Feed> getAllFeeds() {
        logger.debug("Getting feed all feeds");
        return feedService.getAllFeeds();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Feed> getFeedById(@PathVariable String id) {
        logger.debug("Getting feed for id {}", id);
        return feedService.getFeedById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public Feed addFeed(@RequestBody Feed feed) {
        logger.debug("Creating feed {}", feed);
        return feedService.addFeed(feed);
    }

    @PatchMapping("/{id}")
    public ResponseEntity<Feed> patchFeed(@PathVariable String id, @RequestBody Map<String, Object> updates) {
        logger.debug("Patching feed id {} with, {}", id, updates);
        return feedService.patchFeed(id, updates)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteFeed(@PathVariable String id) {
        logger.debug("Deleting feed id {}", id);
        feedService.deleteFeed(id);
        return ResponseEntity.noContent().build();
    }

    @PatchMapping("/refresh")
    public ResponseEntity<String> refreshFeeds() throws Exception {
        logger.debug("Refreshing feeds");
        // Trigger the feed scanning and wait for the result
        CompletableFuture<Integer> newItemsFuture = feedScannerService.scanFeeds();
        int totalNewItems = newItemsFuture.get(); // Block until completed; consider async handling for production
        return ResponseEntity.ok("Feeds refreshed successfully, " + totalNewItems + " new items added.");
    }
}