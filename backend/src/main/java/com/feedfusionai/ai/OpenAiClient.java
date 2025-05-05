package com.feedfusionai.ai;

import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;
import org.springframework.web.reactive.function.client.WebClient;
import org.springframework.web.reactive.function.client.WebClientResponseException;
import reactor.core.publisher.Mono;

import java.util.*;

import jakarta.annotation.PostConstruct;

@Component("openai")
@RequiredArgsConstructor
public class OpenAiClient implements AiClient {

    @Value("${openai.api.key}")
    private String apiKey;

    @Value("${OPENAI_MODEL:gpt-3.5-turbo}")
    private String model;

    private WebClient webClient;

    @PostConstruct
    public void init() {
        this.webClient = WebClient.builder()
                .baseUrl("https://api.openai.com/v1/chat/completions")
                .defaultHeader("Authorization", "Bearer " + apiKey)
                .defaultHeader("Content-Type", "application/json")
                .build();
    }

    private Object[] buildSummarizationPrompt(String content) {
        return new Object[] {
            Map.of("role", "system", "content",
                "You are a helpful assistant that summarizes articles clearly and concisely in 2–3 sentences."),
            Map.of("role", "user", "content", "Summarize the following content:\n\n" + content)
        };
    }

    private Object[] buildTaggingPrompt(String content) {
        return new Object[] {
            Map.of("role", "system", "content",
                "You are an assistant that extracts relevant, " +
                        "concise, lowercase tags from the article. " +
                        "Avoid duplicates and return them as a comma-separated list only."),
            Map.of("role", "user", "content",
                "List 3 to 5 relevant and concise tags for this article, separated by commas:\n\n" + content)
        };
    }

    @Override
    public Mono<String> summarize(String content) {
        final Map<String, Object> requestBody = Map.of(
                "model", model,
                "messages", buildSummarizationPrompt(content)
        );

        return webClient.post()
                .bodyValue(requestBody)
                .retrieve()
                .bodyToMono(Map.class)
                .map(response -> {
                    final var choices = (java.util.List<?>) response.get("choices");
                    if (choices != null && !choices.isEmpty()) {
                        final var choice = (Map<?, ?>) choices.get(0);
                        final var message = (Map<?, ?>) choice.get("message");
                        System.out.println("Generated tags: " + message.get("content"));
                        return ((String) message.get("content")).trim().replaceAll("\\s+", " ");
                    }
                    return null;
                })
                .onErrorResume(WebClientResponseException.class, e -> {
                    System.err.println("OpenAI summarization failed: " + e.getResponseBodyAsString());
                    return Mono.error(new RuntimeException("OpenAI request failed", e));
                });
    }

    @Override
    public Mono<String> generateTags(String content) {
        final Map<String, Object> requestBody = Map.of(
                "model", model,
                "messages", buildTaggingPrompt(content)
        );

        return webClient.post()
                .bodyValue(requestBody)
                .retrieve()
                .bodyToMono(Map.class)
                .map(response -> {
                    final var choices = (List<?>) response.get("choices");
                    if (choices != null && !choices.isEmpty()) {
                        final var choice = (Map<?, ?>) choices.get(0);
                        final var message = (Map<?, ?>) choice.get("message");
                        return ((String) message.get("content")).trim().replaceAll("\\s+", " ");
                    }
                    return "";
                })
                .onErrorResume(WebClientResponseException.class, e -> {
                    System.err.println("OpenAI tag generation failed: " + e.getResponseBodyAsString());
                    return Mono.error(new RuntimeException("OpenAI tag generation failed", e));
                });
    }
}