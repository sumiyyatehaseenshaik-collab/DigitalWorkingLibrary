package com.library.digital.controllers;

import com.library.digital.dto.BorrowDto;
import com.library.digital.models.BorrowRecord;
import com.library.digital.services.BorrowService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/borrow")
public class BorrowController {
    @Autowired
    private BorrowService borrowService;

    @PostMapping("/{bookId}")
    public ResponseEntity<?> borrowBook(@PathVariable Long bookId, @RequestParam("userId") Long userId) {
        try {
            BorrowRecord record = borrowService.borrowBook(bookId, userId);
            return ResponseEntity.ok(record);
        } catch (Exception e) {
            Map<String, String> err = new HashMap<>();
            err.put("message", e.getMessage());
            return ResponseEntity.badRequest().body(err);
        }
    }

    @PostMapping("/return/{bookId}")
    public ResponseEntity<?> returnBook(@PathVariable Long bookId, @RequestParam("userId") Long userId) {
        try {
            BorrowRecord record = borrowService.returnBook(bookId, userId);
            return ResponseEntity.ok(record);
        } catch (Exception e) {
            Map<String, String> err = new HashMap<>();
            err.put("message", e.getMessage());
            return ResponseEntity.badRequest().body(err);
        }
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<List<BorrowDto>> getUserBorrows(@PathVariable Long userId) {
        return ResponseEntity.ok(borrowService.getUserBorrows(userId));
    }

    @GetMapping("/active/user/{userId}")
    public ResponseEntity<List<BorrowDto>> getUserActiveBorrows(@PathVariable Long userId) {
        return ResponseEntity.ok(borrowService.getUserActiveBorrows(userId));
    }

    @GetMapping("/all")
    public ResponseEntity<List<BorrowDto>> getAllBorrows() {
        return ResponseEntity.ok(borrowService.getAllBorrows());
    }
}
