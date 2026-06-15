package com.library.digital.repositories.mongo;

import com.library.digital.models.mongo.MongoBook;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface MongoBookRepository extends MongoRepository<MongoBook, String> {
}