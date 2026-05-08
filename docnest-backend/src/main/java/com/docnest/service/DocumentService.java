package com.docnest.service;

import com.docnest.dto.DocumentDTO;
import com.docnest.entity.Client;
import com.docnest.entity.Document;
import com.docnest.exception.ResourceNotFoundException;
import com.docnest.repository.ClientRepository;
import com.docnest.repository.DocumentRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.core.io.Resource;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class DocumentService {

    private final DocumentRepository documentRepository;
    private final ClientRepository clientRepository;
    private final FileStorageService fileStorageService;
    private final ActivityService activityService;

    @Transactional
    public DocumentDTO uploadDocument(Long clientId, String documentType, MultipartFile file) {
        Client client = clientRepository.findById(clientId)
                .orElseThrow(() -> new ResourceNotFoundException("Client not found: " + clientId));

        if (documentType == null || documentType.isBlank()) {
            documentType = fileStorageService.detectDocumentType(file.getOriginalFilename());
        }

        String relativePath = fileStorageService.storeFile(file, clientId);

        Document doc = Document.builder()
                .client(client)
                .documentType(documentType.toUpperCase())
                .fileName(file.getOriginalFilename())
                .filePath(relativePath)
                .build();

        Document saved = documentRepository.save(doc);
        activityService.log("DOCUMENT_UPLOADED",
                documentType + " uploaded for " + client.getFirstName() + " " + client.getLastName(),
                "DOCUMENT", saved.getId());
        return toDTO(saved);
    }

    @Transactional
    public DocumentDTO replaceDocument(Long documentId, MultipartFile file) {
        Document doc = documentRepository.findById(documentId)
                .orElseThrow(() -> new ResourceNotFoundException("Document not found: " + documentId));

        if (doc.getFilePath() != null) {
            fileStorageService.deleteFile(doc.getFilePath());
        }

        String relativePath = fileStorageService.storeFile(file, doc.getClient().getId());
        doc.setFileName(file.getOriginalFilename());
        doc.setFilePath(relativePath);

        Document saved = documentRepository.save(doc);
        activityService.log("DOCUMENT_REPLACED",
                doc.getDocumentType() + " replaced for client #" + doc.getClient().getId(),
                "DOCUMENT", saved.getId());
        return toDTO(saved);
    }

    @Transactional
    public void deleteDocument(Long documentId) {
        Document doc = documentRepository.findById(documentId)
                .orElseThrow(() -> new ResourceNotFoundException("Document not found: " + documentId));
        if (doc.getFilePath() != null) fileStorageService.deleteFile(doc.getFilePath());
        String desc = doc.getDocumentType() + " deleted for client #" + doc.getClient().getId();
        documentRepository.delete(doc);
        activityService.log("DOCUMENT_DELETED", desc, "DOCUMENT", documentId);
    }

    public List<DocumentDTO> getDocumentsForClient(Long clientId) {
        return documentRepository.findByClientId(clientId)
                .stream().map(this::toDTO).collect(Collectors.toList());
    }

    public Resource loadDocumentAsResource(Long documentId) {
        Document doc = documentRepository.findById(documentId)
                .orElseThrow(() -> new ResourceNotFoundException("Document not found: " + documentId));
        return fileStorageService.loadFileAsResource(doc.getFilePath());
    }

    public DocumentDTO getDocumentById(Long id) {
        Document doc = documentRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Document not found: " + id));
        return toDTO(doc);
    }

    private DocumentDTO toDTO(Document d) {
        return DocumentDTO.builder()
                .id(d.getId())
                .clientId(d.getClient().getId())
                .clientName(d.getClient().getFirstName() + " " + d.getClient().getLastName())
                .documentType(d.getDocumentType())
                .fileName(d.getFileName())
                .filePath(d.getFilePath())
                .uploadDate(d.getUploadDate())
                .previewUrl("/api/documents/preview/" + d.getId())
                .build();
    }
}
