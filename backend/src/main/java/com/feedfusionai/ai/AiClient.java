package com.feedfusionai.ai;

import reactor.core.publisher.Mono;
import java.util.List;

public interface AiClient {
    Mono<String> summarize(String content);
    Mono<String> generateTags(String content);
}