package com.docnest.dto;

import lombok.*;

import java.time.LocalDate;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class FamilyMemberDTO {

    private Long id;
    private Long clientId;
    private String memberName;
    private String relation;
    private LocalDate dob;
    private String gender;
    private String mobile;
}
