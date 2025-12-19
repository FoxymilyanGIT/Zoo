package com.example.zoopark.repository;

import com.example.zoopark.model.Animal;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface AnimalRepository extends JpaRepository<Animal, Long> {

    @Query(value = """
            SELECT * FROM animals a
            WHERE (:q IS NULL OR a.name::text ILIKE CONCAT('%', :q, '%'))
              AND (:species IS NULL OR a.species = :species)
              AND (:zone IS NULL OR a.zone = :zone)
              AND (:status IS NULL OR a.status = :status)
            """, 
            countQuery = """
            SELECT COUNT(*) FROM animals a
            WHERE (:q IS NULL OR a.name::text ILIKE CONCAT('%', :q, '%'))
              AND (:species IS NULL OR a.species = :species)
              AND (:zone IS NULL OR a.zone = :zone)
              AND (:status IS NULL OR a.status = :status)
            """,
            nativeQuery = true)
    Page<Animal> search(
            @Param("q") String q,
            @Param("species") String species,
            @Param("zone") String zone,
            @Param("status") String status,
            Pageable pageable
    );
}


