package com.docnest.dto;

import lombok.*;

import java.util.List;

/**
 * Represents a single node in the react-d3-tree family tree.
 * react-d3-tree expects: { name, attributes, children[] }
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class FamilyTreeNodeDTO {

    private String name;
    private NodeAttributes attributes;
    private List<FamilyTreeNodeDTO> children;

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class NodeAttributes {
        private String relation;
        private String gender;
        private String mobile;
        private String dob;
        private Long memberId;
    }
}
