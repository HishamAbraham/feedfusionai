package com.feedfusionai.service;

import com.feedfusionai.model.Feed;
import com.feedfusionai.model.FeedItem;
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
import java.util.Objects;
import java.util.Optional;
import java.util.concurrent.CompletableFuture;

@Service
public class FeedScannerService {

    @Autowired
    private RestTemplate restTemplate;

    @Autowired
    private FeedService feedService;

    @Autowired
    private FeedItemService feedItemService;

    /**
     * Asynchronously scans all feeds and returns the total number of new feed items added.
     */
    @Async
    public CompletableFuture<Integer> scanFeeds() {
        int totalNewItems = 0;
        List<Feed> feeds = feedService.getAllFeeds();
        for (Feed feed : feeds) {
            totalNewItems += scanFeed(feed);
        }
        return CompletableFuture.completedFuture(totalNewItems);
    }

    /**
     * Scans an individual feed and returns the number of new feed items added.
     */
    public int scanFeed(Feed feed) {
        int newItemsCount = 0;
        try {
            String xmlContent = restTemplate.getForObject(feed.getUrl(), String.class);
            if (xmlContent != null) {
                List<FeedItem> parsedItems = parseFeedContent(xmlContent);
                System.out.println("Scanned feed: " + feed.getTitle() + " (" + feed.getUrl() + "), found " + parsedItems.size() + " items.");

                for (FeedItem parsedItem : parsedItems) {
                    // Set the parent feed ID and default read flag for new items.
                    parsedItem.setFeedId(feed.getId());

                    Optional<FeedItem> existingOpt = feedItemService.findByFeedLink(parsedItem.getFeedLink());
                    if (existingOpt.isPresent()) {
                        FeedItem existingItem = existingOpt.get();
                        boolean updated = false;

                        // Compare and update title
                        if (!Objects.equals(existingItem.getTitle(), parsedItem.getTitle())) {
                            existingItem.setTitle(parsedItem.getTitle());
                            updated = true;
                        }
                        // Compare and update description
                        if (!Objects.equals(existingItem.getDescription(), parsedItem.getDescription())) {
                            existingItem.setDescription(parsedItem.getDescription());
                            updated = true;
                        }
                        // Compare and update publication date
                        if (!Objects.equals(existingItem.getPublishedDate(), parsedItem.getPublishedDate())) {
                            existingItem.setPublishedDate(parsedItem.getPublishedDate());
                            updated = true;
                        }

                        if (updated) {
                            // Only if an update occurred, mark item as unread and save.
                            existingItem.setRead(false);
                            feedItemService.updateFeedItem(existingItem.getFeedId(),existingItem);
                        }
                    } else {
                        // New item—ensure it is marked unread.
                        parsedItem.setRead(false);
                        feedItemService.addFeedItem(parsedItem);
                        newItemsCount++;
                    }
                }
                // Update the feed's lastFetched timestamp.
                feed.setLastFetched(Instant.now());
                feedService.addFeed(feed);
            }
        } catch (Exception e) {
            System.err.println("Error scanning feed: " + feed.getUrl() + " - " + e.getMessage());
        }
        return newItemsCount;
    }

    /**
     * Parses the raw XML content of an RSS feed and returns a list of FeedItem objects.
     * Extracts title, link, description, and published date.
     *
     * @param xmlContent the raw XML content from the feed.
     * @return a list of parsed FeedItem objects.
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
                // Removed thumbnail extraction for now.
                items.add(feedItem);
            }
        } catch (Exception e) {
            System.err.println("Error parsing feed content: " + e.getMessage());
        }
        return items;
    }
}