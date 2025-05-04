package com.feedfusionai.ai;
import io.netty.channel.ChannelOption;
import io.netty.handler.timeout.ReadTimeoutHandler;
import reactor.netty.http.client.HttpClient;
import reactor.netty.tcp.TcpClient;


import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;
import org.springframework.web.reactive.function.client.WebClient;
import reactor.core.publisher.Mono;

import java.util.Map;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

@Component("ollama")
public class OllamaAiClient implements AiClient {

    private static final Logger LOGGER = LoggerFactory.getLogger(OllamaAiClient.class);

    private final WebClient webClient;
    private final String model;

    public OllamaAiClient(@Value("${ollama.base-url:http://localhost:11434}") String baseUrl,
                          @Value("${ollama.model:mistral:7b-instruct}") String model,
                          @Value("${ollama.timeout.connect:5000}") long connectTimeoutMillis,
                          @Value("${ollama.timeout.read:30000}") long readTimeoutMillis) {
        final TcpClient tcpClient = TcpClient.create()
                .option(ChannelOption.CONNECT_TIMEOUT_MILLIS, (int) connectTimeoutMillis)
                .doOnConnected(conn ->
                        conn.addHandlerLast(new ReadTimeoutHandler(readTimeoutMillis,
                                java.util.concurrent.TimeUnit.MILLISECONDS)));

        this.webClient = WebClient.builder()
                .baseUrl(baseUrl)
                .clientConnector(new org.springframework.http.client.reactive.ReactorClientHttpConnector(
                        HttpClient.from(tcpClient)))
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
                        "prompt", prompt
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
                        "prompt", prompt
                ))
                .retrieve()
                .bodyToMono(Map.class)
                .map(response -> (String) response.getOrDefault("response", ""))
                .onErrorResume(e -> Mono.error(new RuntimeException("Ollama generateTags failed", e)));
    }
}
