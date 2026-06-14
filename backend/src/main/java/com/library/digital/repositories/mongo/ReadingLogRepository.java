package com.library.digital.repositories.mongo;

import com.library.digital.models.mongo.ReadingLog;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface ReadingLogRepository extends MongoRepository<ReadingLog, String> {
    List<ReadingLog> findByUserId(Long userId);
}
