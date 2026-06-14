package com.library.digital.repositories;

import com.library.digital.models.BorrowRecord;
import com.library.digital.models.User;
import com.library.digital.models.Book;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

@Repository
public interface BorrowRecordRepository extends JpaRepository<BorrowRecord, Long> {
    List<BorrowRecord> findByUser(User user);
    List<BorrowRecord> findByUserAndStatus(User user, String status);
    Optional<BorrowRecord> findByUserAndBookAndStatus(User user, Book book, String status);
    long countByStatus(String status);
}
