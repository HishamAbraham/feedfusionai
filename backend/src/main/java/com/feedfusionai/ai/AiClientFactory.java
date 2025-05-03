package com.feedfusionai.ai;

import org.springframework.stereotype.Component;
import java.util.Map;

@Component
public class AiClientFactory {

    private final Map<String, AiClient> clientMap;

    public AiClientFactory(Map<String, AiClient> clientMap) {
        this.clientMap = Map.copyOf(clientMap); // makes an unmodifiable shallow copy
    }

    public AiClient getClient(String provider) {
        return clientMap.getOrDefault(provider, clientMap.get("openai")); // fallback
    }
}