package com.docnest.dto;

import lombok.*;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class DocumentDTO {

    private Long id;
    private Long clientId;
    private String clientName;
    private String documentType;
    private String fileName;
    private String filePath;
    private LocalDateTime uploadDate;
    private String previewUrl;
}
