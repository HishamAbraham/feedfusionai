package com.feedfusionai.scheduler;

import com.feedfusionai.service.FeedScannerService;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

@Component
public class FeedAutoRefreshScheduler {

    private static final Logger LOGGER = LoggerFactory.getLogger(FeedAutoRefreshScheduler.class);

    private final FeedScannerService feedScannerService;

    public FeedAutoRefreshScheduler(FeedScannerService feedScannerService) {
        this.feedScannerService = feedScannerService;
    }

    // Automatically scans feeds at a fixed interval (default: 3600000 ms = 1 hour)
    @Scheduled(fixedRateString = "${feedfusionai.feed-refresh-interval-ms:3600000}")
    public void autoRefreshFeeds() {
        LOGGER.info("Starting scheduled feed scan...");
        feedScannerService.scanFeeds(); // Ensure this method exists in FeedService
        LOGGER.info("Scheduled feed scan complete.");
    }
}
