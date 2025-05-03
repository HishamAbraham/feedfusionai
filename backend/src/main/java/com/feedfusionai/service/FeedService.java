package com.feedfusionai.service;

import com.feedfusionai.model.Feed;
import com.feedfusionai.repository.FeedItemRepository;
import com.feedfusionai.repository.FeedRepository;
import com.rometools.rome.feed.synd.SyndFeed;
import com.rometools.rome.io.FeedException;
import com.rometools.rome.io.SyndFeedInput;
import org.springframework.beans.factory.annotation.*;
import org.springframework.stereotype.Service;

import java.net.URL;
import java.time.Instant;
import java.util.List;
import java.util.Map;
import java.util.Optional;

import javax.xml.parsers.SAXParserFactory;
import javax.xml.parsers.ParserConfigurationException;
import org.xml.sax.InputSource;
import org.xml.sax.XMLReader;
import org.xml.sax.SAXException;
import org.jdom2.input.SAXBuilder;
import org.jdom2.JDOMException;
import java.io.IOException;

@Service
public class FeedService {

    @Autowired
    private FeedRepository feedRepository;

    @Autowired
    private FeedItemRepository feedItemRepository;


    public List<Feed> getAllFeeds() {
        final List<Feed> feeds = feedRepository.findAll();
        for (Feed feed : feeds) {
            feed.setUnreadCount(feedItemRepository.countByFeedIdAndReadFalse(feed.getId()));
        }
        return feeds;
    }

    public Optional<Feed> getFeedById(String id) {
        final Optional<Feed> feed = feedRepository.findById(id);
        feed.ifPresent(value -> value.setUnreadCount(feedItemRepository.countByFeedIdAndReadFalse(value.getId())));
        return feed;
    }

    public Feed addFeed(Feed feed) {
        // 1) Fetch metadata from the URL
        try {
            final URL feedUrl = new URL(feed.getUrl());

            final SAXParserFactory factory = SAXParserFactory.newInstance();
            factory.setNamespaceAware(true);
            // Allow DOCTYPE but block external entities
            factory.setFeature("http://apache.org/xml/features/disallow-doctype-decl", false);
            factory.setFeature("http://xml.org/sax/features/external-general-entities", false);
            factory.setFeature("http://xml.org/sax/features/external-parameter-entities", false);

            final XMLReader xmlReader = factory.newSAXParser().getXMLReader();
            final InputSource inputSource = new InputSource(feedUrl.openStream());

            final SAXBuilder saxBuilder = new SAXBuilder();
            saxBuilder.setXMLReaderFactory(new NonValidatingXmlReaderFactory(xmlReader));

            final SyndFeedInput input = new SyndFeedInput();
            final org.jdom2.Document document = saxBuilder.build(inputSource);
            final SyndFeed syndFeed = input.build(document);

            // 2) Populate your Feed entity
            feed.setTitle(syndFeed.getTitle());
            feed.setDescription(syndFeed.getDescription());
            feed.setUrl(syndFeed.getLink());

            if (syndFeed.getImage() != null) {
                feed.setImageUrl(syndFeed.getImage().getUrl());
            }

            feed.setLastFetched(Instant.now());
            feed.setUnreadCount(0);
        } catch (IOException | JDOMException | ParserConfigurationException | SAXException | FeedException e) {
            throw new RuntimeException("Failed to retrieve feed metadata from " + feed.getUrl(), e);
        }

        // 3) Save to MongoDB
        return feedRepository.save(feed);
    }

    // Method to update specific fields using PATCH
    public Optional<Feed> patchFeed(String id, Map<String, Object> updates) {
        final Optional<Feed> optionalFeed = feedRepository.findById(id);
        Optional<Feed> result = Optional.empty();
        if (optionalFeed.isPresent()) {
            final Feed feed = optionalFeed.get();

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

            result = Optional.of(feedRepository.save(feed));
        }
        return result;
    }

    public void deleteFeed(String id) {
        // 1) remove all items for that feed
        feedItemRepository.deleteByFeedId(id);
        // 2) then delete the feed itself
        feedRepository.deleteById(id);
    }

    private static class NonValidatingXmlReaderFactory implements org.jdom2.input.sax.XMLReaderJDOMFactory {
        private final XMLReader xmlReader;

        public NonValidatingXmlReaderFactory(XMLReader xmlReader) {
            this.xmlReader = xmlReader;
        }

        @Override
        public XMLReader createXMLReader() {
            return xmlReader;
        }

        @Override
        public boolean isValidating() {
            return false;
        }
    }
}