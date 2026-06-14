package com.library.digital.services;

import com.library.digital.dto.BookDto;
import com.library.digital.exceptions.ResourceNotFoundException;
import com.library.digital.models.Book;
import com.library.digital.repositories.BookRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class BookService {
    @Autowired
    private BookRepository bookRepository;

    public List<Book> getAllBooks() {
        return bookRepository.findAll();
    }

    public Book getBookById(Long id) {
        return bookRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Book not found with id: " + id));
    }

    public List<Book> getBooksByCategory(String category) {
        return bookRepository.findByCategory(category);
    }

    public List<Book> searchBooks(String query) {
        return bookRepository.searchBooks(query);
    }

    public Book createBook(BookDto bookDto) {
        Book book = new Book();
        book.setTitle(bookDto.getTitle());
        book.setAuthor(bookDto.getAuthor());
        book.setCategory(bookDto.getCategory());
        book.setSummary(bookDto.getSummary());
        book.setCoverImage(bookDto.getCoverImage());
        book.setTotalCount(bookDto.getTotalCount());
        book.setAvailabilityCount(bookDto.getTotalCount()); // initial availability matches total stock
        return bookRepository.save(book);
    }

    public Book updateBook(Long id, BookDto bookDto) {
        Book book = getBookById(id);
        book.setTitle(bookDto.getTitle());
        book.setAuthor(bookDto.getAuthor());
        book.setCategory(bookDto.getCategory());
        book.setSummary(bookDto.getSummary());
        book.setCoverImage(bookDto.getCoverImage());
        
        int diff = bookDto.getTotalCount() - book.getTotalCount();
        book.setTotalCount(bookDto.getTotalCount());
        book.setAvailabilityCount(Math.max(0, book.getAvailabilityCount() + diff));
        
        return bookRepository.save(book);
    }

    public void deleteBook(Long id) {
        Book book = getBookById(id);
        bookRepository.delete(book);
    }
}
