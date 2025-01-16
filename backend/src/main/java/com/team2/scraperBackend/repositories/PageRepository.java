package com.team2.scraperBackend.repositories;

import com.team2.scraperBackend.models.Page;
import com.team2.scraperBackend.models.Website;
import org.springframework.data.repository.CrudRepository;
import org.springframework.data.repository.query.Param;

import java.util.List;

/**
 * CRUD Repository for the Page table
 * @author Matthew Bannock
 * @see Page
 */
public interface PageRepository extends CrudRepository<Page, Long> {

    /**
     * Find a single page by its URL
     * @param url URL to search by
     * @param website Website the page belongs to
     * @return Page with this URL
     */
    Page findByPgURLAndWebsite(@Param("url") String url, Website website);

    /**
     * Find a single page by its URL and the website id
     * @param url URL to search by
     * @param websiteId ID of website the page belongs to
     * @return Page with this URL
     */
    Page findByPgURLAndWebsite_Id(@Param("url") String url, long websiteId);

    /**
     * Find pages where the associated website has the given URL
     * @param url URL of the website
     * @return A list of pages belonging to this website
     */
    List<Page> findByWebsite_WebURL(@Param("url") String url);

    /**
     * Find pages where the associated website has the given id and the page has no parent
     * @param websiteId Id of the website
     * @return A list of pages belonging to this website and that have no parent
     */
    List<Page> findByWebsite_IdAndParentIsNull(long websiteId);
}
