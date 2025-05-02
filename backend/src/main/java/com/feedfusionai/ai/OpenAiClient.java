// src/main/java/com/feedfusionai/ai/OpenAiClient.java
package com.feedfusionai.ai;

import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;
import org.springframework.web.reactive.function.client.WebClient;
import org.springframework.web.reactive.function.client.WebClientResponseException;
import reactor.core.publisher.Mono;
import java.util.Map;
import jakarta.annotation.PostConstruct;

@Component("openai")
@RequiredArgsConstructor
public class OpenAiClient implements AiClient {

    @Value("${openai.api.key}")
    private String apiKey;

    private WebClient webClient;

    @PostConstruct
    public void init() {
        this.webClient = WebClient.builder()
                .baseUrl("https://api.openai.com/v1/chat/completions")
                .defaultHeader("Authorization", "Bearer " + apiKey)
                .defaultHeader("Content-Type", "application/json")
                .build();
    }

    @Override
    public Mono<String> summarize(String content) {
        Map<String, Object> requestBody = Map.of(
                "model", "gpt-3.5-turbo",
                "messages", new Object[] {
                        Map.of("role", "system", "content", "You summarize articles."),
                        Map.of("role", "user", "content", "Summarize this content:\n" + content)
                }
        );

        return webClient.post()
                .bodyValue(requestBody)
                .retrieve()
                .bodyToMono(Map.class)
                .map(response -> {
                    var choices = (java.util.List<?>) response.get("choices");
                    if (choices != null && !choices.isEmpty()) {
                        var choice = (Map<?, ?>) choices.get(0);
                        var message = (Map<?, ?>) choice.get("message");
                        return (String) message.get("content");
                    }
                    return null;
                })
                .onErrorResume(WebClientResponseException.class, e ->
                        Mono.error(new RuntimeException("OpenAI request failed", e)));
    }

    @Override
    public Mono<String> generateTags(String content) {
        // Optional future method
        return Mono.just("");
    }
}