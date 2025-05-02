package com.feedfusionai;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.http.client.HttpClientAutoConfiguration;
import org.springframework.boot.autoconfigure.web.client.RestClientAutoConfiguration;
import org.springframework.scheduling.annotation.EnableAsync;
import org.springframework.scheduling.annotation.EnableScheduling;

@SpringBootApplication(exclude = {
		HttpClientAutoConfiguration.class,
		RestClientAutoConfiguration.class
})
@EnableAsync
@EnableScheduling
public class FeedfusionaiBackendApplication {
	public static void main(String[] args) {
		SpringApplication.run(FeedfusionaiBackendApplication.class, args);
	}
}