package com.feedfusionai.service;

import com.feedfusionai.model.Feed;
import com.feedfusionai.repository.FeedRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
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

    public Feed updateFeed(String id, Feed feed) {
        return feedRepository.findById(id)
                .map(existingFeed -> {
                    existingFeed.setTitle(feed.getTitle());
                    existingFeed.setUrl(feed.getUrl());
                    existingFeed.setLastFetched(feed.getLastFetched());
                    return feedRepository.save(existingFeed);
                })
                .orElseThrow(() -> new RuntimeException("Feed not found with id " + id));
    }

    public void deleteFeed(String id) {
        feedRepository.deleteById(id);
    }
}