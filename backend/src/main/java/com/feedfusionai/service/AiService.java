package com.feedfusionai.service;

import com.feedfusionai.ai.AiClient;
import com.feedfusionai.ai.AiClientFactory;
import com.feedfusionai.repository.FeedItemRepository;
import edu.umd.cs.findbugs.annotations.SuppressFBWarnings;
import org.springframework.stereotype.Service;
import reactor.core.publisher.Mono;

@Service
public class AiService {
    private final AiClientFactory aiClientFactory;
    @SuppressFBWarnings({"EI_EXPOSE_REP2", "URF_UNREAD_FIELD"})
    private final FeedItemRepository feedItemRepository;

    public AiService(AiClientFactory aiClientFactory, FeedItemRepository feedItemRepository) {
        this.aiClientFactory = aiClientFactory;
        this.feedItemRepository = feedItemRepository;
    }

    public Mono<String> summarizeContent(String content) {
        final AiClient client = aiClientFactory.getClient("openai");
        return client.summarize(content);
    }

    public Mono<String> generateTags(String content) {
        final AiClient client = aiClientFactory.getClient("openai");
        return client.generateTags(content);
    }
}