package com.example.googlesso;

import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;

import static org.junit.jupiter.api.Assertions.assertEquals;

@SpringBootTest
class GoogleSsoApplicationTests {
	@Test
	void contextLoads() {}
	// Write a test that hits the GoogleSSOController.index() endpoint and asserts that the response is "Greetings from Spring Boot!\n"
	void testIndex() {
		GoogleSSOController controller = new GoogleSSOController();
		String response = controller.index();
		assertEquals("Greetings from Spring Boot!\n", response);
	}
}