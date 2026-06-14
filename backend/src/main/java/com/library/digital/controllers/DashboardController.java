package com.library.digital.controllers;

import com.library.digital.dto.DashboardStats;
import com.library.digital.models.User;
import com.library.digital.repositories.BookRepository;
import com.library.digital.repositories.BorrowRecordRepository;
import com.library.digital.repositories.UserRepository;
import com.library.digital.services.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/dashboard")
public class DashboardController {
    @Autowired
    private BookRepository bookRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private BorrowRecordRepository borrowRecordRepository;

    @Autowired
    private UserService userService;

    @GetMapping("/stats")
    public ResponseEntity<DashboardStats> getDashboardStats() {
        long totalBooks = bookRepository.count();
        long users = userRepository.count();
        long activeBorrows = borrowRecordRepository.countByStatus("BORROWED");
        long borrowedBooks = borrowRecordRepository.count(); 

        return ResponseEntity.ok(new DashboardStats(
                totalBooks,
                borrowedBooks,
                users,
                activeBorrows
        ));
    }

    @GetMapping("/users")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<User>> getAllUsers() {
        return ResponseEntity.ok(userService.getAllUsers());
    }
}
