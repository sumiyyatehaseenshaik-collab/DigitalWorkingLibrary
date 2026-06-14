package com.library.digital.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDate;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class BorrowDto {
    private Long id;
    private Long bookId;
    private String bookTitle;
    private String bookAuthor;
    private Long userId;
    private String username;
    private LocalDate borrowDate;
    private LocalDate returnDate;
    private String status;
}
