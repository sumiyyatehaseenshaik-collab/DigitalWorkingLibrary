package com.library.digital.models.mongo;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import java.time.LocalDateTime;

@Document(collection = "search_activities")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class SearchActivity {
    @Id
    private String id;
    
    private Long userId;
    private String query;
    private LocalDateTime timestamp = LocalDateTime.now();
}
