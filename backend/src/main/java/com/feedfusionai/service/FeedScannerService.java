package com.feedfusionai.service;

import com.feedfusionai.model.Feed;
import com.feedfusionai.model.FeedItem;
import com.rometools.modules.mediarss.MediaModule;
import com.rometools.modules.mediarss.types.MediaContent;
import com.rometools.rome.feed.synd.SyndEntry;
import com.rometools.rome.feed.synd.SyndFeed;
import com.rometools.rome.io.SyndFeedInput;
import com.rometools.rome.io.XmlReader;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.io.ByteArrayInputStream;
import java.nio.charset.StandardCharsets;
import java.time.Instant;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
public class FeedScannerService {

    @Autowired
    private RestTemplate restTemplate;

    // Instead of directly autowiring FeedRepository, we now use FeedService
    @Autowired
    private FeedService feedService;

    @Autowired
    private FeedItemService feedItemService;

    @Async
    public void scanFeeds() {
        List<Feed> feeds = feedService.getAllFeeds();
        for (Feed feed : feeds) {
            scanFeed(feed);
        }
    }

    public void scanFeed(Feed feed) {
        try {
            String xmlContent = restTemplate.getForObject(feed.getUrl(), String.class);
            if (xmlContent != null) {
                List<FeedItem> parsedItems = parseFeedContent(xmlContent);
                System.out.println("Scanned feed: " + feed.getTitle() + " (" + feed.getUrl() + "), found " + parsedItems.size() + " items.");

                for (FeedItem parsedItem : parsedItems) {
                    // Associate the feed item with the parent feed
                    parsedItem.setFeedId(feed.getId());

                    // Check for an existing feed item by feedId and link via the FeedItemService
                    Optional<FeedItem> existingOpt = feedItemService.findByFeedLink(parsedItem.getFeedLink());
                    if (existingOpt.isPresent()) {
                        FeedItem existingItem = existingOpt.get();
                        // Update fields if necessary
                        existingItem.setTitle(parsedItem.getTitle());
                        existingItem.setDescription(parsedItem.getDescription());
                        existingItem.setPublishedDate(parsedItem.getPublishedDate());
                        feedItemService.updateFeedItem(existingItem.getFeedId(), existingItem);
                    } else {
                        feedItemService.addFeedItem(parsedItem);
                    }
                }

                // Update the feed's lastFetched timestamp and save via FeedService
                feed.setLastFetched(Instant.now());
                feedService.addFeed(feed);  // Assuming you have a method saveFeed() or updateFeed() in FeedService
            }
        } catch (Exception e) {
            System.err.println("Error scanning feed: " + feed.getUrl() + " - " + e.getMessage());
        }
    }

    /**
     * Parses the raw XML content of an RSS feed and returns a list of FeedItem objects.
     *
     * @param xmlContent the raw XML content of the feed
     * @return a list of parsed FeedItem objects
     */
    private List<FeedItem> parseFeedContent(String xmlContent) {
        List<FeedItem> items = new ArrayList<>();
        try {
            SyndFeedInput input = new SyndFeedInput();
            SyndFeed syndFeed = input.build(new XmlReader(new ByteArrayInputStream(xmlContent.getBytes(StandardCharsets.UTF_8))));
            for (SyndEntry entry : syndFeed.getEntries()) {
                FeedItem feedItem = new FeedItem();
                feedItem.setTitle(entry.getTitle());
                feedItem.setFeedLink(entry.getLink());
                feedItem.setPublishedDate(entry.getPublishedDate() != null ? entry.getPublishedDate().toInstant() : Instant.now());
                if (entry.getDescription() != null) {
                    feedItem.setDescription(entry.getDescription().getValue());
                }
                items.add(feedItem);
            }
        } catch (Exception e) {
            System.err.println("Error parsing feed content: " + e.getMessage());
        }
        return items;
    }
}