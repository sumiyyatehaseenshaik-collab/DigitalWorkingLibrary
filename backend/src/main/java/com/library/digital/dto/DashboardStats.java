package com.library.digital.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class DashboardStats {
    private long totalBooks;
    private long borrowedBooks;
    private long users;
    private long activeBorrows;
}
