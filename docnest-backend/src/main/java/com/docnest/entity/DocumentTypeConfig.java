package com.docnest.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "document_type_config")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class DocumentTypeConfig {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "type_name", nullable = false, unique = true, length = 50)
    private String typeName;

    @Column(name = "display_name", nullable = false, length = 100)
    private String displayName;

    @Column(name = "description", length = 255)
    private String description;

    @Column(name = "is_required", nullable = false)
    @Builder.Default
    private Boolean isRequired = true;

    @Column(name = "is_active", nullable = false)
    @Builder.Default
    private Boolean isActive = true;

    @Column(name = "allowed_extensions", length = 100)
    @Builder.Default
    private String allowedExtensions = "pdf,jpg,jpeg,png";

    @Column(name = "max_size_mb")
    @Builder.Default
    private Integer maxSizeMb = 20;
}
