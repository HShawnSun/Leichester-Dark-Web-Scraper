package com.team2.scraperBackend.controllers;

import jakarta.annotation.PostConstruct;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.io.*;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;

/**
 * A Controller for recording information about incoming requests. It records
 * date and time, ip address, and request method type among other things
 * @author Hamood Al Hinai
 */
@RestController
public class LoggerController {

    /*
      A function that is run once after the class is constructed by SpringBoot.
      It creates a log file if one doesn't already exist.
     */
//    @PostConstruct
//    public void createLogFile() {
//        try {
//            File log = new File("access.log");
//            if (log.createNewFile()) {
//                System.out.println("Log file created: " + log.getName());
//            } else {
//                System.out.println("Log file already exists.");
//            }
//        } catch (IOException e) {
//            System.out.println("An error occurred while creating log file.");
//            e.printStackTrace();
//        }
//    }

    /*
     * Runs every time a request is received by the server, and prints useful
     * information about it to the console and a dedicated log file.
     * @param request request object to be processed
     */
//    @RequestMapping(value = "*")
//    public void printLog(HttpServletRequest request) {
//        String url = String.valueOf(request.getRequestURL());
//        String ip = request.getRemoteAddr();
//        String method = request.getMethod();
//        StringBuilder body = new StringBuilder();
//
//        if (method.equals("POST")) {
//            try {
//                BufferedReader reader = request.getReader();
//                int intValueOfChar;
//                while ((intValueOfChar = reader.read()) != -1) {
//                    body.append((char) intValueOfChar);
//                }
//                reader.close();
//            } catch (IOException e) {
//                System.out.println("An error occurred while reading request body.");
//                e.printStackTrace();
//            }
//        }
//
//        DateTimeFormatter dtf = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss");
//        String time = dtf.format(LocalDateTime.now());
//        String logMessage = time + " REQUEST " + ip + " " + method + " " + url + " " + body + "\n";
//
//        try {
//            FileWriter logWriter = new FileWriter("access.log", true);
//            logWriter.write(logMessage);
//            System.out.print(logMessage);
//            logWriter.close();
//        } catch (IOException e) {
//            System.out.println("An error occurred while writing to log file.");
//            e.printStackTrace();
//        }
//    }
}
