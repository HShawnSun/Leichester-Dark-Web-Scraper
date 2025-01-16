package com.team2.scraperBackend.models;

import jakarta.persistence.*;

import java.util.Set;

/**
 * Page table properties
 * @author Matthew Bannock
 */
@Entity
@Table(uniqueConstraints = {@UniqueConstraint(name = "UniqueWebsiteAndRelativeURL", columnNames = {"pgURL", "website"})})
public class Page {

    /**
     * Auto-generated ID
     */
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long Id;

    /**
     * The title of this page. Should be what is displayed in the tab title
     */
    @Column(nullable = false, length = 127)
    private String pgTitle;

    /**
     * The URL of this page
     */
//    @Column(nullable = false, unique = true)
    @Column(nullable = false, length = 2047)
    private String pgURL;

    /**
     * The set of pages which are navigable from this page
     */
    @OneToMany(mappedBy = "parent")
    private Set<Page> children;

    /**
     * The page this page was reached from. In the event it can be reached from multiple pages, this should be the one
     * highest in the tree (closest to the root)
     */
    @ManyToOne
    private Page parent;

    /**
     * The website this page belongs to
     * @see Website
     */
    @ManyToOne
    @JoinColumn(nullable = false)
    private Website website;

    /**
     * The set of captures for this page
     * @see Capture
     */
    @OneToMany(mappedBy = "page")
    private Set<Capture> captures;

    /**
     * Default (empty) constructor
     */
    public Page() {}

    /**
     * Get page ID
     * @return Page ID number
     */
    public long getId() {
        return Id;
    }

    /**
     * Set page ID (please do not use since the ID should be unique)
     * @param pgID Page ID number
     */
    public void setId(long pgID) {
        this.Id = pgID;
    }

    /**
     * Get page title
     * @return Page title
     */
    public String getPgTitle() {
        return pgTitle;
    }

    /**
     * Set page title
     * @param pgTitle Page title. Must not be a blank string
     */
    public void setPgTitle(String pgTitle) {
        if (pgTitle.isBlank()) throw new IllegalArgumentException("pgTitle cannot be blank");
        this.pgTitle = pgTitle;
    }

    /**
     * Get page URL
     * @return Page URL
     */
    public String getPgURL() {
        return pgURL;
    }

    /**
     * Set page URL
     * @param pgURL Page URL. Must be a valid URL without a domain, e.g. /page/childPage
     */
    public void setPgURL(String pgURL) {
        if (!pgURL.matches("(/[^/]+)*/?")) {
            throw new IllegalArgumentException("pgURL must be a valid URL of the form /page/anotherPage");
        }
        this.pgURL = pgURL;
    }

    /**
     * Get parent page
     * @return Parent page
     */
    public Page getParent() {
        return parent;
    }

    /**
     * Set parent page
     * @param parent Parent page
     */
    public void setParent(Page parent) {
        this.parent = parent;
    }

    /**
     * Get website
     * @return Website
     * @see Website
     */
    public Website getWebsite() {
        return website;
    }

    /**
     * Set website
     * @param website Website
     * @see Website
     */
    public void setWebsite(Website website) {
        this.website = website;
    }

    /**
     * Get page captures
     * @return Captures
     * @see Capture
     */
    public Set<Capture> getCaptures() {
        return captures;
    }

    /**
     * Associate a capture with the page
     * @param capture Capture to associate
     * @see Capture
     */
    public void addCapture(Capture capture) {
        this.captures.add(capture);
    }

    /**
     * Get the child pages of the page
     * @return Child pages
     */
    public Set<Page> getChildren() {
        return children;
    }

    /**
     * Associate a page as a child of the page
     * @param page Page to associate as child
     */
    public void addChild(Page page) {
        this.children.add(page);
    }
}
