package com.feedfusionai.service;

import com.feedfusionai.controller.FeedController;
import com.feedfusionai.model.Feed;
import com.feedfusionai.model.FeedItem;
import com.feedfusionai.repository.FeedRepository;
import com.feedfusionai.repository.FeedItemRepository;
import com.rometools.rome.feed.synd.*;
import com.rometools.rome.io.*;
import org.jsoup.Jsoup;
import org.jsoup.nodes.Document;
import org.jsoup.select.Elements;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.io.ByteArrayInputStream;
import java.io.IOException;
import java.io.StringReader;
import java.nio.charset.StandardCharsets;
import java.time.Instant;
import java.util.ArrayList;
import java.util.List;

@Service
public class FeedScannerService {

    private final FeedRepository feedRepository;
    private final FeedItemRepository feedItemRepository;
    private final RestTemplate restTemplate = new RestTemplate();

    private static final Logger logger = LoggerFactory.getLogger(FeedScannerService.class);

    public FeedScannerService(
            FeedRepository feedRepository,
            FeedItemRepository feedItemRepository
    ) {
        this.feedRepository     = feedRepository;
        this.feedItemRepository = feedItemRepository;
    }

    public void scanFeeds() {
        List<Feed> feeds = feedRepository.findAll();
        for (Feed f : feeds) {
            try {
                // 1) Fetch raw content + inspect headers
                ResponseEntity<String> resp = restTemplate.getForEntity(f.getUrl(), String.class);
                String raw = resp.getBody();
                if (raw == null) {
                    throw new IllegalStateException("Empty response from " + f.getUrl());
                }

                MediaType ct = resp.getHeaders().getContentType();
                boolean isHtmlType = ct != null && ct.includes(MediaType.TEXT_HTML);
                boolean isXmlType = ct != null && (
                        ct.includes(MediaType.APPLICATION_XML) ||
                                ct.includes(MediaType.APPLICATION_ATOM_XML) ||
                                ct.includes(MediaType.valueOf("application/rss+xml")) ||
                                ct.includes(MediaType.TEXT_XML)
                );

                // 2) If it really is HTML (by header or content) and not already XML, discover true feed URL
                if ((isHtmlType || looksLikeHtml(raw)) && !isXmlType) {
                    String discovered = discoverFeedUrl(f.getUrl());
                    logger.info("Discovered feed URL for {} → {}", f.getUrl(), discovered);

                    ResponseEntity<String> rssResp = restTemplate.getForEntity(discovered, String.class);
                    raw = rssResp.getBody();
                    if (raw == null) {
                        throw new IllegalStateException("Empty RSS response from " + discovered);
                    }
                }

                // 3) Parse entries (with DOCTYPE‑stripping fallback)
                List<FeedItem> items = parseFeedContent(raw);

                // 4) Dedupe & save new items
                int newCount = 0;
                for (FeedItem item : items) {
                    if (!feedItemRepository.existsByFeedLinkAndFeedId(item.getFeedLink(), f.getId())) {
                        item.setFeedId(f.getId());
                        item.setRead(false);
                        feedItemRepository.save(item);
                        newCount++;
                    }
                }

                // 5) Update Feed metadata
                f.setLastFetched(Instant.now());
                feedRepository.save(f);

                logger.info("Scanned feed {}: added {} new items", f.getUrl(), newCount);
            }
            catch (Exception ex) {
                logger.error("Error scanning feed {}: {}", f.getUrl(), ex.getMessage());
            }
        }
    }

    /** Heuristic: does this string look like an HTML page? */
    private boolean looksLikeHtml(String s) {
        String t = s.trim().toLowerCase();
        return t.startsWith("<!doctype html") || t.startsWith("<html");
    }

    /** Parses RSS/Atom XML, stripping <!DOCTYPE> on parse errors. */
    private List<FeedItem> parseFeedContent(String xmlContent) {
        List<FeedItem> items = new ArrayList<>();
        try {
            SyndFeedInput input = new SyndFeedInput();
            SyndFeed feed;
            try {
                feed = input.build(new XmlReader(
                        new ByteArrayInputStream(xmlContent.getBytes(StandardCharsets.UTF_8))
                ));
            } catch (Exception ex) {
                String msg = ex.getMessage() != null ? ex.getMessage().toLowerCase() : "";
                if (msg.contains("disallow-doctype-decl") || msg.contains("doctype")) {
                    String cleaned = xmlContent.replaceAll("(?i)<!DOCTYPE[^>]*>", "");
                    feed = input.build(new StringReader(cleaned));
                } else {
                    throw ex;
                }
            }
            for (SyndEntry entry : feed.getEntries()) {
                FeedItem item = new FeedItem();
                item.setTitle(entry.getTitle());
                item.setFeedLink(entry.getLink());
                item.setPublishedDate(
                        entry.getPublishedDate() != null
                                ? entry.getPublishedDate().toInstant()
                                : Instant.now()
                );
                if (entry.getDescription() != null) {
                    item.setDescription(entry.getDescription().getValue());
                }
                items.add(item);
            }
        }
        catch (Exception e) {
            logger.error("Error parsing feed content: {}", e.getMessage());
        }
        return items;
    }

    /**
     * Use jsoup to pull <link type="application/rss+xml" ...> or atom link.
     */
    private String discoverFeedUrl(String pageUrl) throws IOException {
        Document doc = Jsoup.connect(pageUrl)
                .userAgent("Mozilla/5.0 (Windows NT 10.0; Win64; x64)")
                .referrer("https://www.google.com")
                .timeout(10_000)
                .get();

        Elements links = doc.select("link[type=application/rss+xml], link[type=application/atom+xml]");
        if (!links.isEmpty()) {
            return links.first().absUrl("href");
        }
        throw new IllegalStateException("No RSS/Atom feed link found at " + pageUrl);
    }
}