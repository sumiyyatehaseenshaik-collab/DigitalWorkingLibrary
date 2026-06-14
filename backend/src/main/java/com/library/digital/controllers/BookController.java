package com.library.digital.controllers;

import com.library.digital.models.Book;
import com.library.digital.repositories.BookRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/books")
@CrossOrigin(origins = "*")
public class BookController {

    @Autowired
    private BookRepository bookRepository;

    // =========================
    // GET ALL BOOKS
    // =========================
    @GetMapping
    public List<Book> getAllBooks() {

        return bookRepository.findAll();
    }

    // =========================
    // ADD BOOK
    // =========================
    @PostMapping
    public ResponseEntity<?> addBook(
            @RequestBody Book book) {

        Book savedBook = bookRepository.save(book);

        return ResponseEntity.ok(savedBook);
    }

    // =========================
    // UPDATE BOOK
    // =========================
   
    @PutMapping("/{id}")
    public ResponseEntity<?> updateBook(
            @PathVariable Long id,
            @RequestBody Book updatedBook) {

        Book book = bookRepository.findById(id).orElse(null);

        if (book == null) {

            Map<String, String> error = new HashMap<>();

            error.put("message", "Book not found");

            return ResponseEntity.badRequest().body(error);
        }

        book.setTitle(updatedBook.getTitle());
        book.setAuthor(updatedBook.getAuthor());
        book.setCategory(updatedBook.getCategory());
        book.setQuantity(updatedBook.getQuantity());

        bookRepository.save(book);

        return ResponseEntity.ok(book);
    }

    // =========================
    // DELETE BOOK
    // =========================
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteBook(
            @PathVariable Long id) {

        Book book = bookRepository.findById(id).orElse(null);

        if (book == null) {

            Map<String, String> error = new HashMap<>();

            error.put("message", "Book not found");

            return ResponseEntity.badRequest().body(error);
        }

        bookRepository.delete(book);

        Map<String, String> response = new HashMap<>();

        response.put("message",
                "Book deleted successfully");

        return ResponseEntity.ok(response);
    }
}