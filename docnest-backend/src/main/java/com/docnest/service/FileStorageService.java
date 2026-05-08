package com.docnest.service;

import com.docnest.exception.FileStorageException;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.net.MalformedURLException;
import java.nio.file.*;
import java.util.UUID;

@Service
public class FileStorageService {

    @Value("${file.upload-dir}")
    private String uploadDir;

    public String storeFile(MultipartFile file, Long clientId) {
        try {
            Path clientDir = Paths.get(uploadDir, "client_" + clientId).toAbsolutePath().normalize();
            Files.createDirectories(clientDir);

            String originalName = file.getOriginalFilename();
            String extension = "";
            if (originalName != null && originalName.contains(".")) {
                extension = originalName.substring(originalName.lastIndexOf("."));
            }
            String uniqueName = UUID.randomUUID().toString() + extension;
            Path targetPath = clientDir.resolve(uniqueName);
            Files.copy(file.getInputStream(), targetPath, StandardCopyOption.REPLACE_EXISTING);

            return Paths.get("client_" + clientId, uniqueName).toString().replace("\\", "/");
        } catch (IOException e) {
            throw new FileStorageException("Failed to store file: " + e.getMessage());
        }
    }

    public void deleteFile(String relativePath) {
        try {
            Path filePath = Paths.get(uploadDir, relativePath).toAbsolutePath().normalize();
            Files.deleteIfExists(filePath);
        } catch (IOException e) {
            throw new FileStorageException("Failed to delete file: " + e.getMessage());
        }
    }

    public Resource loadFileAsResource(String relativePath) {
        try {
            Path filePath = Paths.get(uploadDir, relativePath).toAbsolutePath().normalize();
            Resource resource = new UrlResource(filePath.toUri());
            if (resource.exists() && resource.isReadable()) {
                return resource;
            }
            throw new FileStorageException("File not found or not readable: " + relativePath);
        } catch (MalformedURLException e) {
            throw new FileStorageException("File not found: " + relativePath);
        }
    }

    public String detectDocumentType(String filename) {
        if (filename == null) return null;
        String lower = filename.toLowerCase();
        if (lower.contains("aadhar") || lower.contains("aadhaar")) return "AADHAR";
        if (lower.contains("pan"))                                   return "PAN";
        if (lower.contains("driving") || lower.contains("license") || lower.contains("licence")) return "DRIVING_LICENSE";
        if (lower.contains("electricity") || lower.contains("bill") || lower.contains("elec"))   return "ELECTRICITY_BILL";
        return null;
    }
}
