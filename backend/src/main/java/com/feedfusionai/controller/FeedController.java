package com.feedfusionai.controller;

import com.feedfusionai.model.Feed;
import com.feedfusionai.service.FeedService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/feeds")
public class FeedController {

    @Autowired
    private FeedService feedService;

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

    // PUT /api/feeds/{id} - Update an existing feed
    @PutMapping("/{id}")
    public ResponseEntity<Feed> updateFeed(@PathVariable String id, @RequestBody Feed feed) {
        try {
            Feed updatedFeed = feedService.updateFeed(id, feed);
            return ResponseEntity.ok(updatedFeed);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    // DELETE /api/feeds/{id} - Delete a feed
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteFeed(@PathVariable String id) {
        feedService.deleteFeed(id);
        return ResponseEntity.noContent().build();
    }
}