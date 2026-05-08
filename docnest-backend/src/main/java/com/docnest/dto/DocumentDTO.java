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
    private LocalDateTime uploadDate;
    private String previewUrl;
}
