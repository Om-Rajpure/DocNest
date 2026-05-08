package com.docnest.repository;

import com.docnest.entity.Document;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface DocumentRepository extends JpaRepository<Document, Long> {

    List<Document> findByClientId(Long clientId);

    Optional<Document> findByClientIdAndDocumentType(Long clientId, String documentType);

    boolean existsByClientIdAndDocumentType(Long clientId, String documentType);

    long countByClientId(Long clientId);

    @Query("SELECT COUNT(d) FROM Document d GROUP BY d.documentType")
    List<Long> countByDocumentTypeGrouped();

    @Query("SELECT d.documentType, COUNT(d) FROM Document d GROUP BY d.documentType")
    List<Object[]> countByDocumentType();

    List<Document> findTop10ByOrderByUploadDateDesc();
}
