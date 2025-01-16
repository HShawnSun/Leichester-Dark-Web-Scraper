package com.team2.scraperBackend.repositories;

import com.team2.scraperBackend.models.Capture;
import org.springframework.content.commons.store.ContentStore;
import org.springframework.content.rest.StoreRestResource;

/**
 * Content store for Capture images
 * @author Matthew Bannock
 * @see Capture
 */
@StoreRestResource
public interface CaptureContentStore extends ContentStore<Capture, String> {
}
