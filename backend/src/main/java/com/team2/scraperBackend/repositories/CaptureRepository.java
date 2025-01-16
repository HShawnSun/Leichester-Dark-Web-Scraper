package com.team2.scraperBackend.repositories;

import com.team2.scraperBackend.models.Capture;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;
import org.springframework.data.repository.PagingAndSortingRepository;
import org.springframework.data.repository.query.Param;
import org.springframework.web.bind.annotation.GetMapping;

import java.util.Date;
import java.util.List;

/**
 * CRUD Repository for the Capture table
 * @author Matthew Bannock
 * @author Hamood Al Hinai
 * @see CaptureRepository
 */
public interface CaptureRepository extends PagingAndSortingRepository<Capture, Long>, CrudRepository<Capture, Long> {

    /**
     * Finds all Captures taken from a Page
     * @param page_pgURL url of page to search by
     * @return List of captures taken from specified page
     */
    List<Capture> findByPage_PgURL(@Param("url") String page_pgURL);

    /**
     * Finds all captures from a page taken on a certain calendar date
     * @param page_pgURL url of page to search by
     * @param capDate capture date. In a url parameter use YYYY/MM/DD
     * @return List of captured from a specified page taken on a certain date
     */
    List<Capture> findByPage_PgURLAndCapDate(@Param("url") String page_pgURL, @Param("date") Date capDate);

    /**
     * Finds all captures whose notes contain the given keyword
     * @param keyword text to search for in notes
     * @return List of captures whose notes contain the given keyword
     */
    List<Capture> findByNotesContaining(String keyword);

    /**
     * Finds all captures from a page whose notes contain a given keyword
     * @param page_pgURL url of page to search by
     * @param keyword text to search for in notes
     * @return List of captures from the specified page whose notes contain the given keyword
     */
    List<Capture> findByPage_PgURLAndNotesContaining(String page_pgURL, String keyword);

    /**
     * Finds all captures whose notes or title contain the given keywords
     * @param notes text to search for in page notes
     * @param title text to search for in page title
     * @return List of captures whose notes or title contain the given keywords
     */
    List<Capture> findByNotesContainingOrPage_PgTitleContaining(String notes, String title);

    /**
     * Finds all captures where the given string is contained in any of the associated text fields
     * (i.e. notes, page.{pgTitle, pgURL} and page.website.{webName, webURL, webNotes, webCategory})
     * @param keyword String to search by
     * @return List of matching captures
     */
    @Query("SELECT capture FROM Capture capture WHERE capture.notes LIKE %:keyword% OR capture.page.pgTitle LIKE %:keyword% OR capture.page.pgURL LIKE %:keyword% OR capture.page.website.webCategory LIKE %:keyword% OR capture.page.website.webName LIKE %:keyword% OR capture.page.website.webNotes LIKE %:keyword% OR capture.page.website.webURL LIKE %:keyword%")
    List<Capture> findByKeyword(@Param("keyword") String keyword);

    /**
     * Finds all captures with ids between the specified values
     * @param startId Start of range (inclusive)
     * @param endId End of range (inclusive)
     * @return List of captures with ids between the specified values
     */
    List<Capture> findByIdBetween(long startId, long endId);

    /**
     * Custom SQL query to sum the sizes of the capture contents
     * @return Sum as long int
     */
    @Query("SELECT SUM(contentLength) FROM Capture ")
    long sizeSum();
}
