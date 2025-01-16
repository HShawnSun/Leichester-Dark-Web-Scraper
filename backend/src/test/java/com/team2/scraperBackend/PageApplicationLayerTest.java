package com.team2.scraperBackend;

import com.team2.scraperBackend.models.Website;
import com.team2.scraperBackend.repositories.WebsiteRepository;
import org.junit.jupiter.api.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.context.TestPropertySource;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.result.MockMvcResultHandlers;

import static org.hamcrest.Matchers.emptyIterable;
import static org.hamcrest.Matchers.not;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@TestPropertySource(
        locations = "classpath:testing.properties")
@AutoConfigureMockMvc
@TestMethodOrder(MethodOrderer.OrderAnnotation.class)
public class PageApplicationLayerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private WebsiteRepository websiteRepository;

    static boolean isInitialised = false;

    @BeforeEach
    void prePopulateDB() {
        if (!isInitialised) {
            Website website = new Website();
            website.setWebName("Test Website");
            website.setWebURL("http://www.testpageswebsite.com");
            websiteRepository.save(website);
            isInitialised = true;
        }
    }

    @Test
    @Order(1)
    void shouldAddPageAndReturnConfirmation() throws Exception {
        mockMvc.perform(post("/api/pages")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("""
                                {"pgTitle": "Test page add",
                                "pgURL": "/addTest",
                                "website": "/api/websites/1"}
                                """)
                        .contentType("application/json")
                        .characterEncoding("utf-8"))
                .andDo(MockMvcResultHandlers.print())
                .andExpect(status().is2xxSuccessful());
    }

    @Test
    @Order(2)
    void shouldFailDueToLackingRequiredData() throws Exception {
        mockMvc.perform(post("/api/pages")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("""
                                {"pgTitle": "Test page fail"}
                                """)
                        .contentType("application/json")
                        .characterEncoding("utf-8"))
                .andDo(MockMvcResultHandlers.print())
                .andExpect(status().is4xxClientError());
    }

    @Test
    @Order(3)
    void shouldReturnNonEmptyListOfPages() throws Exception {
        mockMvc.perform(post("/api/pages")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("""
                                {"pgTitle": "Test page list",
                                "pgURL": "/listTest",
                                "website": "/api/websites/1"}
                                """)
                        .contentType("application/json")
                        .characterEncoding("utf-8"))
                .andExpect(status().is2xxSuccessful());
        mockMvc.perform(get("/api/pages"))
                .andDo(MockMvcResultHandlers.print())
                .andExpect(status().isOk())
                .andExpect(content().contentType("application/hal+json"))
                .andExpect(jsonPath("_embedded.pages", not(emptyIterable())));
    }

    @Test
    @Order(4)
    void shouldFailDueToBlankTitle() throws Exception {
        mockMvc.perform(post("/api/pages")
                .contentType(MediaType.APPLICATION_JSON)
                .content("""
                    {"pgTitle": " ",
                    "pgURL": "/blankTest",
                    "website": "/api/websites/1"}
                    """)
                .characterEncoding("utf-8"))
                .andExpect(status().is4xxClientError());
    }

    @Test
    @Order(5)
    void shouldFailDueToLongTitle() throws Exception {
        mockMvc.perform(post("/api/pages")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("""
                    {"pgTitle": "12345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678",
                    "pgURL": "/LongTitleTest",
                    "website": "/api/websites/1"}
                    """)
                        .characterEncoding("utf-8"))
                .andExpect(status().is4xxClientError());
    }

    @Test
    @Order(6)
    void shouldFailDueToBlankURL() throws Exception {
        mockMvc.perform(post("/api/pages")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("""
                    {"pgTitle": "Blank URL Test",
                    "pgURL": " ",
                    "website": "/api/websites/1"}
                    """)
                        .characterEncoding("utf-8"))
                .andExpect(status().is4xxClientError());
    }

    @Test
    @Order(7)
    void shouldFailDueToMalformedURL() throws Exception {
        mockMvc.perform(post("/api/pages")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("""
                    {"pgTitle": "Bad URL Test",
                    "pgURL": "/badUrl//",
                    "website": "/api/websites/1"}
                    """)
                        .characterEncoding("utf-8"))
                .andExpect(status().is4xxClientError());
    }

}
