package com.team2.scraperBackend.models;

import static org.assertj.core.api.Assertions.assertThat;

import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.*;

class WebsiteTest {

    /** Test the only non-default setter */
    @Test
    void setWebCategory() {
        Website website = new Website();
        website.setWebCategory("NotDefault");
        assertThat(website.getWebCategory()).isEqualTo("NotDefault");
        website.setWebCategory("");
        assertThat(website.getWebCategory()).isEqualTo("Default");
        website.setWebCategory(null);
        assertThat(website.getWebCategory()).isEqualTo("Default");
    }
}