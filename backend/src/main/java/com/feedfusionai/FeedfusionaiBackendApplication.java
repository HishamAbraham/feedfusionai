package com.feedfusionai;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.http.client.HttpClientAutoConfiguration;
import org.springframework.boot.autoconfigure.web.client.RestClientAutoConfiguration;
import org.springframework.scheduling.annotation.EnableAsync;

@SpringBootApplication(exclude = {
		HttpClientAutoConfiguration.class,
		RestClientAutoConfiguration.class
})
@EnableAsync
public class FeedfusionaiBackendApplication {
	public static void main(String[] args) {
		SpringApplication.run(FeedfusionaiBackendApplication.class, args);
	}
}