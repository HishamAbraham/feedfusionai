package com.feedfusionai.service;

import com.feedfusionai.ai.AiClient;
import com.feedfusionai.ai.AiClientFactory;
import com.feedfusionai.repository.FeedItemRepository;
import edu.umd.cs.findbugs.annotations.SuppressFBWarnings;
import org.springframework.stereotype.Service;
import reactor.core.publisher.Mono;
import org.springframework.beans.factory.annotation.Value;

@Service
public class AiService {
    @Value("${ai.provider:openai}")
    private String aiProvider;
    private final AiClientFactory aiClientFactory;
    @SuppressFBWarnings({"EI_EXPOSE_REP2", "URF_UNREAD_FIELD"})
    private final FeedItemRepository feedItemRepository;

    public AiService(AiClientFactory aiClientFactory, FeedItemRepository feedItemRepository) {
        this.aiClientFactory = aiClientFactory;
        this.feedItemRepository = feedItemRepository;
    }

    public Mono<String> summarizeContent(String content) {
        final AiClient client = aiClientFactory.getClient(aiProvider);
        return client.summarize(content);
    }

    public Mono<String> generateTags(String content) {
        final AiClient client = aiClientFactory.getClient(aiProvider);
        return client.generateTags(content);
    }
}