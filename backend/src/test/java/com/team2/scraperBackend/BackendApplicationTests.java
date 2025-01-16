package com.team2.scraperBackend;

import static org.assertj.core.api.Assertions.assertThat;

import com.team2.scraperBackend.repositories.WebsiteRepository;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.TestPropertySource;

@SpringBootTest
@TestPropertySource(
		locations = "classpath:testing.properties")
class BackendApplicationTests {

	@Autowired
	WebsiteRepository websiteRepository;

	@Test
	void contextLoads() {
		assertThat(websiteRepository).isNotNull();
	}

}
