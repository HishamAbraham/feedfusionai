package com.feedfusionai;

import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.context.TestPropertySource;

@SpringBootTest
@ActiveProfiles("dev")
@TestPropertySource(properties = "JWT_SECRET=P+H52UdD5J+E3dyZGw+/qGZsZQrOZ6uYpHgHYG02J1A=")
class FeedfusionaiBackendApplicationTests {

	@Test
	void contextLoads() {
	}

}
