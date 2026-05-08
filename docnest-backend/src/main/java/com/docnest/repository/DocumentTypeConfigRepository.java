package com.docnest.repository;

import com.docnest.entity.DocumentTypeConfig;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

@Repository
public interface DocumentTypeConfigRepository extends JpaRepository<DocumentTypeConfig, Long> {
    List<DocumentTypeConfig> findAllByOrderByIdAsc();
    List<DocumentTypeConfig> findByIsActiveTrue();
    Optional<DocumentTypeConfig> findByTypeName(String typeName);
    boolean existsByTypeName(String typeName);
}
