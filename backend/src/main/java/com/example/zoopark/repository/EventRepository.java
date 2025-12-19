package com.example.zoopark.repository;

import com.example.zoopark.model.Event;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.OffsetDateTime;
import java.util.List;

public interface EventRepository extends JpaRepository<Event, Long> {

    @Query(value = """
            SELECT * FROM events e
            WHERE (:q IS NULL OR e.title::text ILIKE CONCAT('%', :q, '%'))
              AND (:type IS NULL OR e.type = :type)
              AND (COALESCE(:dateFrom, '1970-01-01'::timestamptz) = '1970-01-01'::timestamptz OR e.start_time >= COALESCE(:dateFrom, '1970-01-01'::timestamptz))
              AND (COALESCE(:dateTo, '9999-12-31'::timestamptz) = '9999-12-31'::timestamptz OR e.end_time <= COALESCE(:dateTo, '9999-12-31'::timestamptz))
            ORDER BY e.start_time
            """, nativeQuery = true)
    List<Event> search(
            @Param("q") String q,
            @Param("type") String type,
            @Param("dateFrom") OffsetDateTime dateFrom,
            @Param("dateTo") OffsetDateTime dateTo
    );
}


