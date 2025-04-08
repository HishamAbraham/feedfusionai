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

@RestController
@RequestMapping("/api/feeds")
public class FeedController {

    @Autowired
    private FeedService feedService;

    @Autowired
    private FeedScannerService feedScannerService;

    // GET /api/feeds - Retrieve all feeds
    @GetMapping
    public List<Feed> getAllFeeds() {
        return feedService.getAllFeeds();
    }

    // GET /api/feeds/{id} - Retrieve a feed by its ID
    @GetMapping("/{id}")
    public ResponseEntity<Feed> getFeedById(@PathVariable String id) {
        return feedService.getFeedById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    // POST /api/feeds - Add a new feed
    @PostMapping
    public Feed addFeed(@RequestBody Feed feed) {
        return feedService.addFeed(feed);
    }

    // PATCH /api/feeds/{id} - Partially update a feed
    @PatchMapping("/{id}")
    public ResponseEntity<Feed> patchFeed(@PathVariable String id, @RequestBody Map<String, Object> updates) {
        return feedService.patchFeed(id, updates)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    // DELETE /api/feeds/{id} - Delete a feed
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteFeed(@PathVariable String id) {
        feedService.deleteFeed(id);
        return ResponseEntity.noContent().build();
    }

    @PatchMapping("/refresh")
    public ResponseEntity<String> refreshFeeds() throws Exception {
        // Trigger the feed scanning and wait for the result
        CompletableFuture<Integer> newItemsFuture = feedScannerService.scanFeeds();
        int totalNewItems = newItemsFuture.get(); // Block until completed; consider async handling for production
        return ResponseEntity.ok("Feeds refreshed successfully, " + totalNewItems + " new items added.");
    }
}