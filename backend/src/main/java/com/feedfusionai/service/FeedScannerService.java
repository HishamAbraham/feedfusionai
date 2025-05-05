package com.feedfusionai.service;


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
import edu.umd.cs.findbugs.annotations.SuppressFBWarnings;

import java.io.ByteArrayInputStream;
import java.io.IOException;
import java.io.StringReader;
import java.nio.charset.StandardCharsets;
import java.time.Instant;
import java.util.ArrayList;
import java.util.List;
import java.util.Locale;
import java.util.Objects;

@Service
public class FeedScannerService {

    private final FeedRepository feedRepository;
    @SuppressFBWarnings("EI_EXPOSE_REP2")
    private final FeedItemRepository feedItemRepository;

    private static final Logger LOGGER = LoggerFactory.getLogger(FeedScannerService.class);

    @SuppressFBWarnings("EI_EXPOSE_REP2")
    private final RestTemplate restTemplate;
    private final AiService aiService;

    public FeedScannerService(
            FeedRepository feedRepository,
            FeedItemRepository feedItemRepository,
            RestTemplate restTemplate,
            AiService aiService
    ) {
        this.feedRepository     = Objects.requireNonNull(feedRepository);
        this.feedItemRepository = Objects.requireNonNull(feedItemRepository);
        this.restTemplate       = Objects.requireNonNull(restTemplate);
        this.aiService          = Objects.requireNonNull(aiService);
    }

    public int scanFeeds() {
        int newCount = 0;
        final List<Feed> feeds = feedRepository.findAll();
        for (Feed f : feeds) {
            try {
                // 1) Fetch raw content + inspect headers
                final ResponseEntity<String> resp = restTemplate.getForEntity(f.getUrl(), String.class);
                String raw = resp.getBody();
                if (raw == null) {
                    throw new IllegalStateException("Empty response from " + f.getUrl());
                }

                final MediaType ct = resp.getHeaders().getContentType();
                final boolean isHtmlType = ct != null && ct.includes(MediaType.TEXT_HTML);
                final boolean isXmlType = ct != null && (
                        ct.includes(MediaType.APPLICATION_XML) ||
                                ct.includes(MediaType.APPLICATION_ATOM_XML) ||
                                ct.includes(MediaType.valueOf("application/rss+xml")) ||
                                ct.includes(MediaType.TEXT_XML)
                );

                // 2) If it really is HTML (by header or content) and not already XML, discover true feed URL
                if ((isHtmlType || looksLikeHtml(raw)) && !isXmlType) {
                    final String discovered = discoverFeedUrl(f.getUrl());
                    LOGGER.info("Discovered feed URL for {} → {}", f.getUrl(), discovered);

                    final ResponseEntity<String> rssResp = restTemplate.getForEntity(discovered, String.class);
                    raw = rssResp.getBody();
                    if (raw == null) {
                        throw new IllegalStateException("Empty RSS response from " + discovered);
                    }
                }

                // 3) Parse entries (with DOCTYPE‑stripping fallback)
                final List<FeedItem> items = parseFeedContent(raw);

                // 4) Dedupe & save new items

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

                LOGGER.info("Scanned feed {}: added {} new items", f.getUrl(), newCount);
            }
            catch (IOException ex) {
                LOGGER.error("Error scanning feed {}: {}", f.getUrl(), ex.getMessage());
            }
        }
        return newCount;
    }

    /** Heuristic: does this string look like an HTML page? */
    private boolean looksLikeHtml(String s) {
        final String t = s.trim().toLowerCase(Locale.ROOT);
        return t.startsWith("<!doctype html") || t.startsWith("<html");
    }

    /** Parses RSS/Atom XML, stripping <!DOCTYPE> on parse errors. */
    private List<FeedItem> parseFeedContent(String xmlContent) {
        final List<FeedItem> items = new ArrayList<>();
        try {
            final SyndFeedInput input = new SyndFeedInput();
            SyndFeed feed;
            try {
                feed = input.build(new XmlReader(
                        new ByteArrayInputStream(xmlContent.getBytes(StandardCharsets.UTF_8))
                ));
            } catch (Exception ex) {
                final String msg = ex.getMessage() != null ? ex.getMessage().toLowerCase(Locale.ROOT) : "";
                if (msg.contains("disallow-doctype-decl") || msg.contains("doctype")) {
                    final String cleaned = xmlContent.replaceAll("(?i)<!DOCTYPE[^>]*>", "");
                    feed = input.build(new StringReader(cleaned));
                } else {
                    throw ex;
                }
            }
            for (SyndEntry entry : feed.getEntries()) {
                final FeedItem item = createFeedItemFromEntry(entry);
                items.add(item);
            }
        }
        catch (Exception e) {
            LOGGER.error("Error parsing feed content: {}", e.getMessage());
        }
        return items;
    }

    private FeedItem createFeedItemFromEntry(SyndEntry entry) {
        final FeedItem item = new FeedItem();
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
        try {
            final String textToSummarize =
                    Jsoup.parse(item.getDescription() != null ? item.getDescription() : "").text();
            final String summary = aiService.summarizeContent(textToSummarize).block();
            item.setSummary(summary);
            try {
                final String tagString = aiService.generateTags(textToSummarize)
                                            .blockOptional()
                                            .orElse("");
                final List<String> tags = List.of(tagString.split(","));
                final List<String> normalized = tags.stream()
                                              .map(t -> t.toLowerCase(Locale.ROOT).trim())
                                              .filter(t -> !t.isBlank())
                                              .toList();
                item.setTags(normalized);
            } catch (Exception e) {
                LOGGER.warn("Failed to tag content for {}: {}", item.getFeedLink(), e.getMessage());
            }
        } catch (Exception e) {
            LOGGER.warn("Failed to summarize content for {}: {}", item.getFeedLink(), e.getMessage());
        }
        return item;
    }

    /**
     * Use jsoup to pull <link type="application/rss+xml" ...> or atom link.
     */
    private String discoverFeedUrl(String pageUrl) throws IOException {
        final Document doc = Jsoup.connect(pageUrl)
                .userAgent("Mozilla/5.0 (Windows NT 10.0; Win64; x64)")
                .referrer("https://www.google.com")
                .timeout(10_000)
                .get();

        final Elements links = doc.select("link[type=application/rss+xml], link[type=application/atom+xml]");
        if (!links.isEmpty()) {
            return Objects.requireNonNull(links.first()).absUrl("href");
        }
        throw new IllegalStateException("No RSS/Atom feed link found at " + pageUrl);
    }
}