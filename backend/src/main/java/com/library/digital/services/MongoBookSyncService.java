package com.library.digital.services;

import com.library.digital.models.Book;
import com.library.digital.models.mongo.MongoBook;
import com.library.digital.repositories.BookRepository;
import com.library.digital.repositories.mongo.MongoBookRepository;

import jakarta.annotation.PostConstruct;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class MongoBookSyncService {

    @Autowired
    private BookRepository bookRepository;

    @Autowired
    private MongoBookRepository mongoBookRepository;

  //@PostConstruct
    public void syncBooksToMongo() {
        if (mongoBookRepository.count() > 0) {
            return;
        }

        List<Book> books = bookRepository.findAll();

        for (Book book : books) {

            MongoBook mongoBook = new MongoBook();

            mongoBook.setBookId(book.getId());
            mongoBook.setTitle(book.getTitle());
            mongoBook.setAuthor(book.getAuthor());
            mongoBook.setCategory(book.getCategory());
            mongoBook.setQuantity(book.getQuantity());

            mongoBookRepository.save(mongoBook);
        }

        System.out.println("Books copied from PostgreSQL to MongoDB");
    }
}