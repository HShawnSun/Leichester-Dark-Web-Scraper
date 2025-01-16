package com.team2.scraperBackend.controllers;

import com.team2.scraperBackend.repositories.WebsiteRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

/**
 * A Controller for managing the custom endpoints for the website table
 * @author Matthew Bannock
 */
@RestController
public class WebsiteController {

    /**
     * Repository. Automatically initialised by Spring
     */
    @Autowired
    private WebsiteRepository websiteRepository;

    /**
     * Get list of categories currently in use,
     * mapped onto the /websites/categories endpoint and linked to the custom query in the WebsiteRepository
     * @return List of categories
     * @see WebsiteRepository
     */
    @RequestMapping(value = "/websites/categories", method = RequestMethod.GET)
    public List<String> getCategories() {
        return websiteRepository.getCategories();
    }

}
