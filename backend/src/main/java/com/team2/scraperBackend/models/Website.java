package com.team2.scraperBackend.models;

import jakarta.persistence.Entity;
import jakarta.persistence.Column;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.OneToMany;

import java.util.Set;

/**
 * Website table properties
 * @author Matthew Bannock
 */
@Entity
public class Website {

    /**
     * Auto-generated ID
     */
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long Id;

    /**
     * A suitable name representing the whole website
     */
    @Column(nullable = false, length = 127)
    private String webName;

    /**
     * The top-level URL of the website
     */
    @Column(nullable = false, unique = true)
    private String webURL;

    /**
     * The set of pages belonging to this website.
     * These pages should share the same top-level URL, however it is possible to have an internal page with a
     * different address therefore this is not enforced.
     * @see Page
     */
    @OneToMany(mappedBy = "website")
    private Set<Page> pages;

    /**
     * String representing the category of the website. If the website does not belong to a specific category, then it
     * should be set to 'Default'. Length is limited to 32 characters
     */
    @Column(length = 31)
    private String webCategory = "Default";

    /**
     * String containing any notes for this website
     */
    @Column(length = 511)
    private String webNotes;

    /**
     * Default (empty) constructor
     */
    public Website() {
    }

    /**
     * Get website ID
     * @return Website ID number
     */
    public long getId() {
        return Id;
    }

    /**
     * Set website ID (please do not use since the ID should be unique)
     * @param webID Website ID number
     */
    public void setId(long webID) {
        this.Id = webID;
    }

    /**
     * Get website name
     * @return Website name
     */
    public String getWebName() {
        return webName;
    }

    /**
     * Set website name
     * @param webName Website name. Must not be blank
     */
    public void setWebName(String webName) {
        if (webName.isBlank()) throw new IllegalArgumentException("webName cannot be blank");
        this.webName = webName;
    }

    /**
     * Get website URL
     * @return Website URL
     */
    public String getWebURL() {
        return webURL;
    }

    /**
     * Set website URL
     * @param webURL Website URL. Must be a valid root-level url, e.g. 'https://www.example.com'
     */
    public void setWebURL(String webURL) {
        if (!webURL.matches("(https?://)?[^\\s./:]+(\\.[^\\s.]+)*\\.[^\\s.]+"))
            throw new IllegalArgumentException("webURL must be a valid root-level url, e.g. 'https://www.example.com");
        this.webURL = webURL;
    }

    /**
     * Get pages belonging to website
     * @return Set of pages
     * @see Page
     */
    public Set<Page> getPages() {
        return pages;
    }

    /**
     * Associate a page with the website
     * @param page Page to associate
     * @see Page
     */
    public void addPage(Page page) {
        this.pages.add(page);
    }

    /**
     * Get website category
     * @return Website category
     */
    public String getWebCategory() {
        return webCategory;
    }

    /**
     * Set website category. Sets to 'Default' if null or empty string
     * @param webCategory Website category
     */
    public void setWebCategory(String webCategory) {
        if (webCategory == null || webCategory.isEmpty())
            this.webCategory = "Default";
        else
            this.webCategory = webCategory;
    }

    /**
     * Get website notes
     * @return Website notes
     */
    public String getWebNotes() {
        return webNotes;
    }

    /**
     * Set website notes
     * @param webNotes Website notes
     */
    public void setWebNotes(String webNotes) {
        this.webNotes = webNotes;
    }

}
