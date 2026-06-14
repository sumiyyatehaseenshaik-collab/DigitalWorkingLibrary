package com.library.digital.repositories.mongo;

import com.library.digital.models.mongo.SearchActivity;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface SearchActivityRepository extends MongoRepository<SearchActivity, String> {
    List<SearchActivity> findByUserId(Long userId);
}
