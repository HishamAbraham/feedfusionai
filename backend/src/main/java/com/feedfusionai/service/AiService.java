package com.feedfusionai.service;

import com.feedfusionai.ai.AiClient;
import com.feedfusionai.ai.AiClientFactory;
import com.feedfusionai.repository.FeedItemRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import reactor.core.publisher.Mono;

@Service
@RequiredArgsConstructor
public class AiService {
    private final AiClientFactory aiClientFactory;
    private final FeedItemRepository feedItemRepository;

    public Mono<String> summarizeContent(String content) {
        final AiClient client = aiClientFactory.getClient("openai");
        return client.summarize(content);
    }

    public Mono<String> generateTags(String content) {
        final AiClient client = aiClientFactory.getClient("openai");
        return client.generateTags(content);
    }
}