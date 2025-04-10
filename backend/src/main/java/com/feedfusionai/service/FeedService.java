package com.feedfusionai.service;

import com.feedfusionai.model.Feed;
import com.feedfusionai.repository.FeedRepository;
import org.springframework.beans.factory.annotation.*;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@Service
public class FeedService {

    @Autowired
    private FeedRepository feedRepository;


    public List<Feed> getAllFeeds() {
        return feedRepository.findAll();
    }

    public Optional<Feed> getFeedById(String id) {
        return feedRepository.findById(id);
    }

    public Feed addFeed(Feed feed) {
        return feedRepository.save(feed);
    }

    // Method to update specific fields using PATCH
    public Optional<Feed> patchFeed(String id, Map<String, Object> updates) {
        Optional<Feed> optionalFeed = feedRepository.findById(id);
        if (optionalFeed.isPresent()) {
            Feed feed = optionalFeed.get();

            if (updates.containsKey("title")) {
                feed.setTitle((String) updates.get("title"));
            }
            if (updates.containsKey("url")) {
                feed.setUrl((String) updates.get("url"));
            }
            if (updates.containsKey("lastFetched")) {
                // Assuming ISO-8601 String representation; convert to Instant.
                feed.setLastFetched(Instant.parse((String) updates.get("lastFetched")));
            }

            // Add additional fields as needed

            return Optional.of(feedRepository.save(feed));
        }
        return Optional.empty();
    }

    public void deleteFeed(String id) {
        feedRepository.deleteById(id);
    }

}