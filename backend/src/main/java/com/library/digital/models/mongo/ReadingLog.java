package com.library.digital.models.mongo;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import java.time.LocalDateTime;

@Document(collection = "reading_logs")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class ReadingLog {
    @Id
    private String id;
    
    private Long userId;
    private Long bookId;
    private Integer pagesRead;
    private LocalDateTime timestamp = LocalDateTime.now();
}
