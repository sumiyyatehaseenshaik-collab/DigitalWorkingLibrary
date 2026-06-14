package com.library.digital.repositories;

import com.library.digital.models.Book;
import org.springframework.data.jpa.repository.JpaRepository;

public interface BookRepository
        extends JpaRepository<Book, Long> {

}