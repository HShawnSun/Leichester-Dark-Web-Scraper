package com.team2.scraperBackend;

import org.junit.jupiter.api.MethodOrderer;
import org.junit.jupiter.api.Order;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.TestMethodOrder;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.context.TestPropertySource;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.result.MockMvcResultHandlers;

import static org.hamcrest.Matchers.emptyIterable;
import static org.hamcrest.Matchers.not;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@TestPropertySource(
        locations = "classpath:testing.properties")
@AutoConfigureMockMvc
@TestMethodOrder(MethodOrderer.OrderAnnotation.class)
public class WebsiteApplicationLayerTest {

    @Autowired
    private MockMvc mockMvc;

    @Test
    @Order(1)
    void shouldAddWebsiteAndReturnConfirmation() throws Exception {
        mockMvc.perform(post("/api/websites")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("""
                                {"webName": "Test site add",
                                "webURL": "https://addTest.com"}
                                """)
                        .contentType("application/json")
                        .characterEncoding("utf-8"))
                .andDo(MockMvcResultHandlers.print())
                .andExpect(status().is2xxSuccessful());
    }

    @Test
    @Order(2)
    void shouldFailDueToLackingRequiredData() throws Exception {
        mockMvc.perform(post("/api/websites")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("""
                                {"webName": "Test website fail"}
                                """)
                        .contentType("application/json")
                        .characterEncoding("utf-8"))
                .andDo(MockMvcResultHandlers.print())
                .andExpect(status().is4xxClientError());
    }

    @Test
    @Order(3)
    void shouldReturnNonEmptyListOfWebsites() throws Exception {
        mockMvc.perform(post("/api/websites")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("""
                                {"webName": "Test site list",
                                "webURL": "https://listTest.com"}
                                """)
                        .contentType("application/json")
                        .characterEncoding("utf-8"))
                .andExpect(status().is2xxSuccessful());
        mockMvc.perform(get("/api/websites"))
                .andDo(MockMvcResultHandlers.print())
                .andExpect(status().isOk())
                .andExpect(content().contentType("application/hal+json"))
                .andExpect(jsonPath("_embedded.websites", not(emptyIterable())));
    }

    @Test
    @Order(4)
    void shouldFailDueToBlankName() throws Exception {
        mockMvc.perform(post("/api/websites")
                .contentType(MediaType.APPLICATION_JSON)
                .content("""
                    {"webName": " ",
                    "webURL":  "https://blankTest.com"}
                    """)
                .characterEncoding("utf-8"))
                .andExpect(status().is4xxClientError());
    }

    @Test
    @Order(5)
    void shouldFailDueToLongName() throws Exception {
        mockMvc.perform(post("/api/websites")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("""
                    {"webName": "12345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678",
                    "webURL":  "https://longNameTest.com"}
                    """)
                        .characterEncoding("utf-8"))
                .andExpect(status().is4xxClientError());
    }

    @Test
    @Order(6)
    void shouldFailDueToBlankURL() throws Exception {
        mockMvc.perform(post("/api/websites")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("""
                    {"webName": "Test bad URL",
                    "webURL":  " "}
                    """)
                        .characterEncoding("utf-8"))
                .andExpect(status().is4xxClientError());
    }

    @Test
    @Order(7)
    void shouldFailDueToMalformedURL() throws Exception {
        mockMvc.perform(post("/api/websites")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("""
                    {"webName": "Test bad URL",
                    "webURL":  ".badURL"}
                    """)
                        .characterEncoding("utf-8"))
                .andExpect(status().is4xxClientError());
    }

    @Test
    @Order(8)
    void shouldFailDueToLongCategory() throws Exception {
        mockMvc.perform(post("/api/websites")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("""
                    {"webName": "Long category test",
                    "webURL":  "https://longCatTest.com",
                    "webCategory": "12345678901234567890123456789012"}
                    """)
                        .characterEncoding("utf-8"))
                .andExpect(status().is4xxClientError());
    }

    @Test
    @Order(9)
    void shouldFailDueToLongNotes() throws Exception {
        mockMvc.perform(post("/api/websites")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("""
                    {"webName": "Long notes test",
                    "webURL":  "https://longNotesTest.com",
                    "webNotes": "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Quisque vitae sagittis mi, eget vestibulum est. Pellentesque pellentesque mi id consequat sagittis. Nunc odio dui, condimentum vitae congue ac, placerat placerat ante. Phasellus sed quam nunc. Nulla suscipit blandit ex, interdum ultricies erat egestas id. Integer maximus ante justo, sit amet rhoncus ipsum dictum eget. Donec faucibus at libero id pulvinar. Curabitur velit massa, finibus quis sem sed, pulvinar luctus metus. Nunc finibus sodales leo nam."}
                    """)
                        .characterEncoding("utf-8"))
                .andExpect(status().is4xxClientError());
    }
}
