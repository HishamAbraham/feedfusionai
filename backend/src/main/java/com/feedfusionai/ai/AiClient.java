package com.feedfusionai.ai;

import reactor.core.publisher.Mono;

public interface AiClient {
    Mono<String> summarize(String content);
    Mono<String> generateTags(String content);
}