package com.feedfusionai.controller;

import com.feedfusionai.model.Feed;
import com.feedfusionai.service.FeedService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/feeds")
public class FeedController {

    @Autowired
    private FeedService feedService;

    @GetMapping
    public List<Feed> getAllFeeds() {
        return feedService.getAllFeeds();
    }

    @PostMapping
    public Feed addFeed(@RequestBody Feed feed) {
        return feedService.addFeed(feed);
    }

    // Additional endpoints for updating and deleting feeds can be added here
}