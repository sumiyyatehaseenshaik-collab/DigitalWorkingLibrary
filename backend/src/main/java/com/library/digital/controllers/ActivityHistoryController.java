package com.library.digital.controllers;

import com.library.digital.models.Book;
import com.library.digital.models.mongo.ReadingLog;
import com.library.digital.models.mongo.SearchActivity;
import com.library.digital.repositories.BookRepository;
import com.library.digital.repositories.mongo.ReadingLogRepository;
import com.library.digital.repositories.mongo.SearchActivityRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.*;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/activity-history")
public class ActivityHistoryController {

    @Autowired
    private ReadingLogRepository readingLogRepository;

    @Autowired
    private SearchActivityRepository searchActivityRepository;

    @Autowired
    private BookRepository bookRepository;

    @GetMapping("/{userId}")
    public ResponseEntity<List<Map<String, Object>>> getActivityHistory(
            @PathVariable Long userId) {

        List<ReadingLog> readingLogs =
                readingLogRepository.findByUserId(userId);

        List<SearchActivity> searchActivities =
                searchActivityRepository.findByUserId(userId);

        List<Map<String, Object>> activities = new ArrayList<>();

        // Reading Logs
        for (ReadingLog log : readingLogs) {

            Map<String, Object> activity = new HashMap<>();

            String bookTitle = bookRepository.findById(log.getBookId())
                    .map(Book::getTitle)
                    .orElse("Book #" + log.getBookId());

            boolean isBorrow = log.getPagesRead() == 0;

            activity.put(
                    "id",
                    "reading-" + log.getBookId()
            );

            activity.put(
                    "activityType",
                    isBorrow ? "BORROW" : "RETURN"
            );

            activity.put(
                    "details",
                    isBorrow
                            ? "Successfully borrowed book: " + bookTitle
                            : "Returned book: " + bookTitle
            );

            activity.put("timestamp", log.getTimestamp());
            activity.put("userId", log.getUserId());

            activities.add(activity);
        }

        // Search Activities
        for (SearchActivity search : searchActivities) {

            Map<String, Object> activity = new HashMap<>();

            activity.put(
                    "id",
                    "search-" + search.getTimestamp()
            );

            activity.put("activityType", "SEARCH");

            activity.put(
                    "details",
                    "Searched for: " + search.getQuery()
            );

            activity.put("timestamp", search.getTimestamp());
            activity.put("userId", search.getUserId());

            activities.add(activity);
        }

        // Sort by timestamp descending
        activities.sort((a, b) ->
                ((LocalDateTime) b.get("timestamp"))
                        .compareTo((LocalDateTime) a.get("timestamp"))
        );

        return ResponseEntity.ok(activities);
    }
}