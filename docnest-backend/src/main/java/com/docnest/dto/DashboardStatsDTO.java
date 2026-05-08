package com.docnest.dto;

import lombok.*;

import java.util.List;
import java.util.Map;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class DashboardStatsDTO {

    private long totalClients;
    private long totalFamilies;
    private long totalDocuments;
    private long missingDocumentClients;
    private long recentClientsThisMonth;

    // Document breakdown by type: { "AADHAR": 45, "PAN": 30, ... }
    private Map<String, Long> documentsByType;

    // Recent activity (top 10)
    private List<ActivityLogDTO> recentActivities;

    // Recently added clients (top 5)
    private List<ClientDTO> recentClients;

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class ActivityLogDTO {
        private Long id;
        private String action;
        private String description;
        private String entityType;
        private Long entityId;
        private String timestamp;
    }
}
