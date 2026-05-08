package com.docnest.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "system_preference")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class SystemPreference {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "pref_key", nullable = false, unique = true, length = 80)
    private String prefKey;

    @Column(name = "pref_value", length = 255)
    private String prefValue;

    @Column(name = "description", length = 255)
    private String description;
}
