package com.library.digital.services;

import com.library.digital.models.Book;
import com.library.digital.models.mongo.SearchActivity;
import com.library.digital.repositories.BookRepository;
import com.library.digital.repositories.mongo.SearchActivityRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.time.LocalDateTime;
import java.util.*;

@Service
public class SemanticSearchService {
    @Autowired
    private BookRepository bookRepository;

    @Autowired
    private SearchActivityRepository searchActivityRepository;

    private static final Map<String, List<Long>> SEMANTIC_MAP = new HashMap<>();

    static {
        SEMANTIC_MAP.put("artificial intelligence", Arrays.asList(2L, 7L));
        SEMANTIC_MAP.put("machine learning", Arrays.asList(2L, 7L));
        SEMANTIC_MAP.put("beginner friendly programming", Arrays.asList(5L, 20L, 8L));
        SEMANTIC_MAP.put("coding style", Arrays.asList(3L, 9L, 10L, 11L));
        SEMANTIC_MAP.put("database architectures", Arrays.asList(14L, 4L));
        SEMANTIC_MAP.put("ui/ux design principles", Arrays.asList(6L, 15L, 19L));
        SEMANTIC_MAP.put("career development", Arrays.asList(1L, 8L, 12L, 17L));
        SEMANTIC_MAP.put("startup strategy", Arrays.asList(12L, 17L));
    }

    public List<Book> performSemanticSearch(String query, Long userId) {
        String cleanQuery = query.trim().toLowerCase();
        
        SearchActivity activity = new SearchActivity();
        activity.setUserId(userId != null ? userId : 2L); 
        activity.setQuery(query);
        activity.setTimestamp(LocalDateTime.now());
        searchActivityRepository.save(activity);

        List<Long> matchedIds = new ArrayList<>();
        
        for (Map.Entry<String, List<Long>> entry : SEMANTIC_MAP.entrySet()) {
            if (cleanQuery.contains(entry.getKey()) || entry.getKey().contains(cleanQuery)) {
                matchedIds.addAll(entry.getValue());
                break;
            }
        }

        if (!matchedIds.isEmpty()) {
            List<Book> books = new ArrayList<>();
            for (Long id : matchedIds) {
                bookRepository.findById(id).ifPresent(books::add);
            }
            return books;
        }

        return bookRepository.findByTitleContainingIgnoreCase(query);
    }
}
