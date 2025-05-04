package com.feedfusionai.ai;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;
import org.springframework.web.reactive.function.client.WebClient;
import reactor.core.publisher.Mono;

import java.util.Map;

@Component("ollama")
public class OllamaAiClient implements AiClient {

    private final WebClient webClient;
    private final String model;

    public OllamaAiClient(@Value("${ollama.base-url:http://localhost:11434}") String baseUrl,
                          @Value("${ollama.model:mistral:7b-instruct}") String model) {
        this.webClient = WebClient.builder()
                .baseUrl(baseUrl)
                .build();
        this.model = model;
    }

    @Override
    public Mono<String> summarize(String content) {
        final String prompt = "Summarize the following content:\n\n" + content;

        return webClient.post()
                .uri("/api/generate")
                .bodyValue(Map.of(
                        "model", model,
                        "prompt", prompt,
                        "stream", false
                ))
                .retrieve()
                .bodyToMono(Map.class)
                .map(response -> (String) response.getOrDefault("response", ""))
                .onErrorResume(e -> Mono.error(new RuntimeException("Ollama summarizeContent failed", e)));
    }

    @Override
    public Mono<String> generateTags(String content) {
        final String prompt = "Generate relevant short tags for this content (comma separated):\n\n" + content;

        return webClient.post()
                .uri("/api/generate")
                .bodyValue(Map.of(
                        "model", model,
                        "prompt", prompt,
                        "stream", false
                ))
                .retrieve()
                .bodyToMono(Map.class)
                .map(response -> (String) response.getOrDefault("response", ""))
                .onErrorResume(e -> Mono.error(new RuntimeException("Ollama generateTags failed", e)));
    }
}
