package com.team2.scraperBackend.models;

import jakarta.persistence.*;
import org.springframework.content.commons.annotations.ContentId;
import org.springframework.content.commons.annotations.ContentLength;
import org.springframework.content.commons.annotations.MimeType;

import java.util.Date;

/**
 * Capture table properties
 * @author Matthew Bannock
 * @author Hamood Al Hinai
 */
@Entity
public class Capture {

    /**
     * Auto-generated ID
     */
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long Id;

    /**
     * The time this capture was made (set automatically on creation)
     */
    @Column(nullable = false)
    @Temporal(TemporalType.TIME)
    private Date capTime = new Date();

    /**
     * The date this capture was made (set automatically on creation)
     */
    @Column(nullable = false)
    @Temporal(TemporalType.DATE)
    private Date capDate = new Date();

    /**
     * ID of the image for this capture (used internally by SpringContent as the filename
     */
    @ContentId
    private String contentId;

    /**
     * Size of the image in bytes
     */
    @ContentLength
    private long contentLength;

    /**
     * Mime-type of the image (should be an image type, ideally 'image/jpeg'
     */
    @MimeType
    private String contentMimeType = "image/jpeg";

    /**
     * SHA-256 Hash of the image for integrity
     */
    @Column(nullable = false)
    private String contentHash;

    /**
     * The page this capture is of
     * @see Page
     */
    @ManyToOne
    @JoinColumn(nullable = false)
    private Page page;

    @Column(length = 511)
    private String notes;

    /**
     * Default (empty) constructor
     */
    public Capture() {}

    /**
     * Get capture ID
     * @return Capture ID number
     */
    public long getId() {
        return Id;
    }

    /**
     * Set capture ID (please do not use since the ID should be unique)
     * @param capID capture ID number
     */
    public void setId(long capID) {
        this.Id = capID;
    }

    /**
     * Get capture time
     * @return Capture time
     */
    public Date getCapTime() {
        return capTime;
    }

    /**
     * Set the capture time
     * @param capTime Capture time
     */
    public void setCapTime(Date capTime) {
        this.capTime = capTime;
    }

    public Date getCapDate() {
        return capDate;
    }

    public void setCapDate(Date capDate) {
        this.capDate = capDate;
    }

    /**
     * Get page this is a capture of
     * @return Page
     * @see Page
     */
    public Page getPage() {
        return page;
    }

    /**
     * Set page this is a capture of
     * @param page Page
     * @see Page
     */
    public void setPage(Page page) {
        this.page = page;
    }

    /**
     * Get content ID
     * @return Content ID
     */
    public String getContentId() {
        return contentId;
    }

    /**
     * Set content ID
     * @param contentId Content ID
     */
    public void setContentId(String contentId) {
        this.contentId = contentId;
    }

    /**
     * Get content size in bytes
     * @return Content length (size in bytes)
     */
    public long getContentLength() {
        return contentLength;
    }

    /**
     * Set content length (dangerous to use directly)
     * @param contentLength Content length
     */
    public void setContentLength(long contentLength) {
        this.contentLength = contentLength;
    }

    /**
     * Get content MIME-type (e.g. image/jpeg)
     * @return content MIME type
     */
    public String getContentMimeType() {
        return contentMimeType;
    }

    /**
     * Set content MIME-type
     * @param contentMimeType Content MIME-type
     */
    public void setContentMimeType(String contentMimeType) {
        this.contentMimeType = contentMimeType;
    }

    public String getNotes() {
        return notes;
    }

    public void setNotes(String notes) {
        this.notes = notes;
    }

    public void setCapDateAndTime(Date time) {
        setCapDate(time);
        setCapTime(time);
    }

    /**
     * Get the stored hex representation of the SHA-256 hash of the capture image
     * @return SHA-256 Hex string
     */
    public String getContentHash() {
        return contentHash;
    }

    /**
     * Set the SHA-256 hash value for the image
     * @param contentHash Hex representation of SHA-256 hash
     */
    public void setContentHash(String contentHash) {
        if (this.contentHash != null)
            throw new RuntimeException("Hash cannot be changed once set");
        if (!contentHash.matches("([0-9a-f]{64})|([0-9A-F]{64})")) {
            throw new IllegalArgumentException("Hash must be a valid SHA-256 hash");
        }
        this.contentHash = contentHash;
    }


}
