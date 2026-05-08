package com.docnest.dto;

import lombok.*;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ClientDTO {

    private Long id;
    private String firstName;
    private String lastName;
    private String mobile;
    private LocalDate dob;
    private String gender;
    private String address;
    private String email;
    private Long locationId;
    private String locationName;
    private LocalDateTime createdAt;

    // Computed / summary fields
    private long familyMemberCount;
    private long documentCount;
    private boolean hasMissingDocuments;
}
