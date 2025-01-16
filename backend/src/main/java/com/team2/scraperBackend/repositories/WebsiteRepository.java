package com.team2.scraperBackend.repositories;

import com.team2.scraperBackend.models.Website;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;
import org.springframework.data.repository.query.Param;

import java.util.List;

/**
 * CRUD Repository for the Website table
 * @author Matthew Bannock
 * @see Website
 */
public interface WebsiteRepository extends CrudRepository<Website, Long> {

    /**
     * Custom query for getting the collection of categories currently in use
     * @return A list of categories present in the Website table
     */
    @Query("SELECT DISTINCT w.webCategory FROM Website w")
    List<String> getCategories();

    /**
     * Return a single website with the given URL
     * @param url URL to search by
     * @return Website with this URL
     */
    Website findByWebURL(@Param("url") String url);

}
