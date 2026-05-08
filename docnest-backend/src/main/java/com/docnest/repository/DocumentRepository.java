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

    List<Document> findByOwnerTypeAndOwnerId(String ownerType, Long ownerId);

    Optional<Document> findByOwnerTypeAndOwnerIdAndDocumentType(String ownerType, Long ownerId, String documentType);

    boolean existsByOwnerTypeAndOwnerIdAndDocumentType(String ownerType, Long ownerId, String documentType);

    long countByOwnerTypeAndOwnerId(String ownerType, Long ownerId);

    @Query("SELECT d.documentType, COUNT(d) FROM Document d GROUP BY d.documentType")
    List<Object[]> countByDocumentType();

    List<Document> findTop10ByOrderByUploadDateDesc();

    @Query("SELECT COUNT(d) FROM Document d WHERE d.ownerType = 'CLIENT' AND d.ownerId = :clientId")
    long countClientDocuments(@Param("clientId") Long clientId);
}
