package com.feedfusionai.ai;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

import java.util.Map;

@Component
@RequiredArgsConstructor
public class AiClientFactory {

    private final Map<String, AiClient> clientMap;

    public AiClient getClient(String provider) {
        return clientMap.getOrDefault(provider, clientMap.get("openai")); // fallback
    }
}