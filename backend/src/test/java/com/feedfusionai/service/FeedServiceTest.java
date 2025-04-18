package com.feedfusionai.service;

import com.feedfusionai.model.Feed;
import com.feedfusionai.repository.FeedRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;

import java.time.Instant;
import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

class FeedServiceTest {

    @Mock
    private FeedRepository feedRepository;

    @InjectMocks
    private FeedService feedService;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
    }

    @Test
    void testPatchFeed() {
        // Create a sample feed with initial values.
        Feed oldFeed = new Feed();
        oldFeed.setId("1");
        oldFeed.setTitle("Old Title");
        oldFeed.setUrl("http://old.url");
        oldFeed.setLastFetched(Instant.parse("2025-04-05T00:00:00Z"));

        // Create a map of updates that simulates a patch request.
        Map<String, Object> updates = new HashMap<>();
        updates.put("title", "New Title");
        updates.put("url", "http://new.url");
        updates.put("lastFetched", "2025-04-06T00:00:00Z");

        // Set up the repository mock: when findById is called with "1", return the oldFeed.
        when(feedRepository.findById("1")).thenReturn(Optional.of(oldFeed));
        // When save is called, return the feed being saved.
        when(feedRepository.save(any(Feed.class))).thenAnswer(invocation -> invocation.getArgument(0));

        // Call the patchFeed method.
        Optional<Feed> updatedOpt = feedService.patchFeed("1", updates);
        assertTrue(updatedOpt.isPresent());
        Feed updatedFeed = updatedOpt.get();

        // Verify that the updated fields match the expected new values.
        assertEquals("New Title", updatedFeed.getTitle());
        assertEquals("http://new.url", updatedFeed.getUrl());
        assertEquals(Instant.parse("2025-04-06T00:00:00Z"), updatedFeed.getLastFetched());

        // Verify that the repository's save method was called exactly once.
        verify(feedRepository, times(1)).save(oldFeed);
    }
}