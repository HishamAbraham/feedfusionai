package com.feedfusionai.controller;

import com.feedfusionai.model.PromptRequest;
import com.feedfusionai.model.PromptResponse;
import com.feedfusionai.service.AiService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import reactor.core.publisher.Mono;

@RestController
@RequestMapping("/api/ai")
public class AiController {

    @Autowired
    private AiService aiService;

    @PostMapping("/ask")
    public Mono<PromptResponse> askAi(@RequestBody PromptRequest request) {
        return aiService.summarizeContent(request.getUrl())
                .map(PromptResponse::new);
    }

}