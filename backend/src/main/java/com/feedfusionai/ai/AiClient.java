// src/main/java/com/feedfusionai/ai/AiClient.java
package com.feedfusionai.ai;

import reactor.core.publisher.Mono;

public interface AiClient {
    Mono<String> summarize(String content);
    Mono<String> generateTags(String content); // placeholder for later
}