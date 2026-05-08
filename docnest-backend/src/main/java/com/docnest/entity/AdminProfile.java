package com.docnest.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "admin_profile")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AdminProfile {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "full_name", length = 150)
    private String fullName;

    @Column(name = "email", length = 150)
    private String email;

    @Column(name = "mobile", length = 15)
    private String mobile;

    @Column(name = "profile_image", length = 500)
    private String profileImage;
}
