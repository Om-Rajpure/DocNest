package com.docnest.dto;

import lombok.*;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class DocumentDTO {

    private Long id;
    private String ownerType;
    private Long ownerId;
    private String ownerName;
    private String documentType;
    private String fileName;
    private String filePath;
    private String mimeType;
    private Long fileSize;
    private Integer ocrConfidence;
    private LocalDateTime uploadDate;
    private String previewUrl;
}
