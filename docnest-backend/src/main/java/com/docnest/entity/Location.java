package com.docnest.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "location_master")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Location {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "location_name", nullable = false, unique = true, length = 100)
    private String locationName;
}
