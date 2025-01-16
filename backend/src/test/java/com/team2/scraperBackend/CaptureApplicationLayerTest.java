package com.team2.scraperBackend;

import com.team2.scraperBackend.models.Page;
import com.team2.scraperBackend.models.Website;
import com.team2.scraperBackend.repositories.PageRepository;
import com.team2.scraperBackend.repositories.WebsiteRepository;
import org.junit.jupiter.api.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.context.TestPropertySource;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.ResultActions;
import org.springframework.test.web.servlet.result.MockMvcResultHandlers;

import java.io.InputStream;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;

import static org.hamcrest.Matchers.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@TestPropertySource(
        locations = "classpath:testing.properties")
@AutoConfigureMockMvc
@TestMethodOrder(MethodOrderer.OrderAnnotation.class)
public class CaptureApplicationLayerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private WebsiteRepository websiteRepository;

    @Autowired
    private PageRepository pageRepository;

    static boolean isInitialised = false;

    @BeforeEach
    void prePopulateDB() {
        if (!isInitialised) {
            Website website = new Website();
            website.setWebName("Test Website");
            website.setWebURL("http://www.testcapturewebsite.com");
            websiteRepository.save(website);
            Page page = new Page();
            page.setPgTitle("Test page");
            page.setPgURL("/test");
            page.setWebsite(website);
            pageRepository.save(page);
            isInitialised = true;
        }
    }

    static ResultActions captureResult = null;

    private ResultActions addCaptureBasics() throws Exception {
        if (captureResult == null) {
            captureResult = mockMvc.perform(post("/api/captures")
                    .contentType(MediaType.APPLICATION_JSON)
                    .content("""

                            {"page":"/api/pages/1",
                            "contentHash": "0123456789012345678901234567890123456789012345678901234567890123"}
                        """)
                .contentType("application/json")
                .characterEncoding("utf-8"));
        }
        return captureResult;
    }

    @Test
    @Order(1)
    void shouldAddCaptureAndReturnConfirmation() throws Exception {
        addCaptureBasics()
                .andDo(MockMvcResultHandlers.print())
                .andExpect(status().is2xxSuccessful());
    }

    static ResultActions addImageResult = null;

    private ResultActions addImageToCapture() throws Exception {
        if (addImageResult == null) {
            try (InputStream stream = this.getClass().getResourceAsStream("test-image.jpg")) {
                assert stream != null;
                addImageResult = mockMvc.perform(put("/api/captures/1/content")
                                .contentType(MediaType.IMAGE_JPEG)
                                .content(stream.readAllBytes()));
            }
        }
        return addImageResult;
    }

    @Test
    @Order(2)
    void shouldBeAbleToUploadImageToCapture() throws Exception {
        addCaptureBasics();
        addImageToCapture()
                .andExpect(status().is2xxSuccessful());
    }

    @Test
    @Order(3)
    void shouldFailDueToLackingRequiredData() throws Exception {
        mockMvc.perform(post("/api/captures")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("""
                                {}
                                """)
                        .contentType("application/json")
                        .characterEncoding("utf-8"))
                .andDo(MockMvcResultHandlers.print())
                .andExpect(status().is4xxClientError());
    }

    @Test
    @Order(4)
    void shouldReturnNonEmptyListOfCaptures() throws Exception {
        addCaptureBasics()
                .andExpect(status().is2xxSuccessful());
        mockMvc.perform(get("/api/captures"))
                .andDo(MockMvcResultHandlers.print())
                .andExpect(status().isOk())
                .andExpect(content().contentType("application/hal+json"))
                .andExpect(jsonPath("_embedded.captures", not(emptyIterable())));

    }

    @Test
    @Order(5)
    void shouldReturnImageMatchingSrc() throws Exception {
        addCaptureBasics();
        addImageToCapture();
        try (InputStream stream = this.getClass().getResourceAsStream("test-image.jpg")) {
            assert stream != null;
            mockMvc.perform(get("/api/captures/1/content")
                            .accept(MediaType.IMAGE_JPEG))
                    .andExpect(status().is2xxSuccessful())
                    .andExpect(content().contentTypeCompatibleWith(MediaType.IMAGE_JPEG))
                    .andExpect(content().bytes(stream.readAllBytes()));
        }
    }

    @Test
    @Order(6)
    void shouldDeleteCapture() throws Exception {
        addCaptureBasics();
        addImageToCapture();
        mockMvc.perform(delete("/api/captures/1"))
                .andExpect(status().is2xxSuccessful());
    }

    @Test
    @Order(7)
    void shouldFailDueToLongNotes() throws Exception {
        mockMvc.perform(post("/api/captures")
                .contentType(MediaType.APPLICATION_JSON)
                .content("""
                    {"page": "/api/pages/1",
                    "notes": "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Quisque vitae sagittis mi, eget vestibulum est. Pellentesque pellentesque mi id consequat sagittis. Nunc odio dui, condimentum vitae congue ac, placerat placerat ante. Phasellus sed quam nunc. Nulla suscipit blandit ex, interdum ultricies erat egestas id. Integer maximus ante justo, sit amet rhoncus ipsum dictum eget. Donec faucibus at libero id pulvinar. Curabitur velit massa, finibus quis sem sed, pulvinar luctus metus. Nunc finibus sodales leo nam."}
                    """)
                .characterEncoding("utf-8"))
                .andExpect(status().is4xxClientError());
    }

    @Test
    @Order(8)
    void shouldBeAbleToSetDateAndTime() throws Exception {
        LocalDateTime expected = LocalDateTime.parse("2024-02-22T12:00:00");
        addCaptureBasics(); addCaptureBasics(); addCaptureBasics(); // Ensure entry exists at /captures/3
        mockMvc.perform(put("/api/captures/4")
                .contentType(MediaType.APPLICATION_JSON)
                .content("""
                    {"page": "/api/pages/1",
                    "capDateAndTime": "2024-02-22T12:00:00",
                    "contentHash": "0123456789012345678901234567890123456789012345678901234567890123"}
                    """)
                .characterEncoding("utf-8"))
                .andExpect(status().is2xxSuccessful());
    }
}
