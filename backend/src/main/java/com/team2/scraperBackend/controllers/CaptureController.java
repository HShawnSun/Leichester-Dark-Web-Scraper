package com.team2.scraperBackend.controllers;

import com.team2.scraperBackend.repositories.CaptureRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

/** A controller for managing the custom endpoints of the capture table */
@RestController
public class CaptureController {

    /** Repository. Automatically initialised by Spring */
    @Autowired
    CaptureRepository captureRepository;

    /**
     * Get the sum of the content in the capture table
     * @return Response entity with the sum and the HTTP 200 OK status
     */
    @RequestMapping(value = "/captures/sizeSum", method = RequestMethod.GET)
    public ResponseEntity<Object> sizeSum() {
        return new ResponseEntity<>(captureRepository.sizeSum(), HttpStatus.OK);
    }
}
