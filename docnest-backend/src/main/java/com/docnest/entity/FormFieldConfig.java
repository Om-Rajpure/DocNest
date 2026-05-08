package com.docnest.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "form_field_config")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class FormFieldConfig {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "field_name", nullable = false, unique = true, length = 50)
    private String fieldName;

    @Column(name = "label", nullable = false, length = 100)
    private String label;

    @Column(name = "description", length = 255)
    private String description;

    @Column(name = "field_type", length = 20)
    private String fieldType; // TEXT, SELECT, DATE, TEXTAREA

    @Column(name = "is_visible", nullable = false)
    @Builder.Default
    private Boolean isVisible = true;

    @Column(name = "is_required", nullable = false)
    @Builder.Default
    private Boolean isRequired = false;

    @Column(name = "display_order")
    @Builder.Default
    private Integer displayOrder = 0;
}
