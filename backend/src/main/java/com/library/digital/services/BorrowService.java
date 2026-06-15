package com.library.digital.services;

import com.library.digital.dto.BorrowDto;
import com.library.digital.exceptions.ResourceNotFoundException;
import com.library.digital.models.Book;
import com.library.digital.models.BorrowRecord;
import com.library.digital.models.User;
import com.library.digital.models.mongo.ReadingLog;
import com.library.digital.repositories.BookRepository;
import com.library.digital.repositories.BorrowRecordRepository;
import com.library.digital.repositories.UserRepository;
import com.library.digital.repositories.mongo.ReadingLogRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class BorrowService {

    @Autowired
    private BorrowRecordRepository borrowRecordRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private BookRepository bookRepository;

    @Autowired
    private ReadingLogRepository readingLogRepository;

    @Transactional
    public BorrowRecord borrowBook(Long bookId, Long userId) {

        User user = userRepository.findById(userId)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "User not found with id: " + userId));

        Book book = bookRepository.findById(bookId)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Book not found with id: " + bookId));

        if (book.getAvailabilityCount() <= 0) {
            throw new RuntimeException(
                    "Book is currently unavailable for borrowing!");
        }

        Optional<BorrowRecord> activeRecord =
                borrowRecordRepository.findByUserAndBookAndStatus(
                        user,
                        book,
                        "BORROWED");

        if (activeRecord.isPresent()) {
            throw new RuntimeException(
                    "You have already checked out this book!");
        }

        book.setAvailabilityCount(
                book.getAvailabilityCount() - 1);

        bookRepository.save(book);

        BorrowRecord record = new BorrowRecord();

        record.setUser(user);
        record.setBook(book);
        record.setBorrowDate(LocalDate.now());
        record.setStatus("BORROWED");

        BorrowRecord savedRecord =
                borrowRecordRepository.save(record);

        try {

            ReadingLog log = new ReadingLog();

            log.setUserId(userId);
            log.setBookId(bookId);
            log.setPagesRead(0);
            log.setTimestamp(LocalDateTime.now());

            readingLogRepository.save(log);

            System.out.println(
                    "MONGODB LOG SAVED SUCCESSFULLY (BORROW)");

        } catch (Exception e) {

            System.out.println(
                    "MONGODB ERROR (BORROW): "
                            + e.getMessage());

            e.printStackTrace();
        }

        return savedRecord;
    }

    @Transactional
    public BorrowRecord returnBook(Long bookId, Long userId) {

        User user = userRepository.findById(userId)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "User not found with id: " + userId));

        Book book = bookRepository.findById(bookId)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Book not found with id: " + bookId));

        BorrowRecord record =
                borrowRecordRepository.findByUserAndBookAndStatus(
                                user,
                                book,
                                "BORROWED")
                        .orElseThrow(() ->
                                new ResourceNotFoundException(
                                        "No active borrow record found!"));

        book.setAvailabilityCount(
                book.getAvailabilityCount() + 1);

        bookRepository.save(book);

        record.setReturnDate(LocalDate.now());
        record.setStatus("RETURNED");

        BorrowRecord savedRecord =
                borrowRecordRepository.save(record);

        try {

            ReadingLog log = new ReadingLog();

            log.setUserId(userId);
            log.setBookId(bookId);
            log.setPagesRead(120);
            log.setTimestamp(LocalDateTime.now());

            readingLogRepository.save(log);

            System.out.println(
                    "MONGODB LOG SAVED SUCCESSFULLY (RETURN)");

        } catch (Exception e) {

            System.out.println(
                    "MONGODB ERROR (RETURN): "
                            + e.getMessage());

            e.printStackTrace();
        }

        return savedRecord;
    }

    public List<BorrowDto> getUserBorrows(Long userId) {

        User user = userRepository.findById(userId)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "User not found with id: " + userId));

        return borrowRecordRepository.findByUser(user)
                .stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
    }

    public List<BorrowDto> getUserActiveBorrows(Long userId) {

        User user = userRepository.findById(userId)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "User not found with id: " + userId));

        return borrowRecordRepository
                .findByUserAndStatus(user, "BORROWED")
                .stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
    }

    public List<BorrowDto> getAllBorrows() {

        return borrowRecordRepository.findAll()
                .stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
    }

    private BorrowDto convertToDto(BorrowRecord record) {

        return new BorrowDto(
                record.getId(),
                record.getBook().getId(),
                record.getBook().getTitle(),
                record.getBook().getAuthor(),
                record.getUser().getId(),
                record.getUser().getUsername(),
                record.getBorrowDate(),
                record.getReturnDate(),
                record.getStatus()
        );
    }
}