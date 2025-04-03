package com.feedfusionai.service;

import com.feedfusionai.model.Feed;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Service
public class FeedService {

    private final List<Feed> feeds = new ArrayList<>();

    public List<Feed> getAllFeeds() {
        return new ArrayList<>(feeds);
    }

    public Feed addFeed(Feed feed) {
        if (feed.getId() == null) {
            feed.setId(UUID.randomUUID().toString());
        }
        feeds.add(feed);
        return feed;
    }

    public Optional<Feed> getFeedById(String id) {
        return feeds.stream().filter(feed -> feed.getId().equals(id)).findFirst();
    }

    // Add more methods as needed
}