package com.docnest.controller;

import com.docnest.dto.DocumentDTO;
import com.docnest.service.DocumentService;
import lombok.RequiredArgsConstructor;
import org.springframework.core.io.Resource;
import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@RestController
@RequestMapping("/api/documents")
@RequiredArgsConstructor

public class DocumentController {

    private final DocumentService documentService;

    @PostMapping("/upload")
    public ResponseEntity<DocumentDTO> upload(
            @RequestParam Long clientId,
            @RequestParam(required = false) String documentType,
            @RequestParam("file") MultipartFile file) {
        return ResponseEntity.ok(documentService.uploadDocument(clientId, documentType, file));
    }

    @PutMapping("/replace/{id}")
    public ResponseEntity<DocumentDTO> replace(
            @PathVariable Long id,
            @RequestParam("file") MultipartFile file) {
        return ResponseEntity.ok(documentService.replaceDocument(id, file));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        documentService.deleteDocument(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/client/{clientId}")
    public ResponseEntity<List<DocumentDTO>> getByClient(@PathVariable Long clientId) {
        return ResponseEntity.ok(documentService.getDocumentsForClient(clientId));
    }

    @GetMapping("/preview/{id}")
    public ResponseEntity<Resource> preview(@PathVariable Long id) {
        DocumentDTO dto = documentService.getDocumentById(id);
        Resource resource = documentService.loadDocumentAsResource(id);

        String contentType = "application/octet-stream";
        String fileName = dto.getFileName() != null ? dto.getFileName().toLowerCase() : "";
        if (fileName.endsWith(".pdf"))  contentType = "application/pdf";
        else if (fileName.endsWith(".jpg") || fileName.endsWith(".jpeg")) contentType = "image/jpeg";
        else if (fileName.endsWith(".png")) contentType = "image/png";

        return ResponseEntity.ok()
                .contentType(MediaType.parseMediaType(contentType))
                .header(HttpHeaders.CONTENT_DISPOSITION, "inline; filename=\"" + dto.getFileName() + "\"")
                .body(resource);
    }
}
