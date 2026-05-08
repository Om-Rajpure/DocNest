package com.docnest.service;

import com.docnest.dto.DashboardStatsDTO;
import com.docnest.repository.ClientRepository;
import com.docnest.repository.DocumentRepository;
import com.docnest.repository.FamilyMemberRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.LinkedHashMap;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class DashboardService {

    private final ClientRepository clientRepository;
    private final DocumentRepository documentRepository;
    private final FamilyMemberRepository familyMemberRepository;
    private final ActivityService activityService;
    private final ClientService clientService;

    public DashboardStatsDTO getStats() {
        long totalClients   = clientRepository.count();
        long totalDocuments = documentRepository.count();
        long missingDocs    = clientRepository.countClientsWithMissingDocuments();
        long recentClients  = clientRepository.countByCreatedAtAfter(
                LocalDateTime.now().withDayOfMonth(1).withHour(0).withMinute(0));

        // Family count = unique clients that have at least one family member
        long totalFamilies  = familyMemberRepository.count() > 0 ? totalClients : 0;

        // Documents by type
        Map<String, Long> docsByType = new LinkedHashMap<>();
        for (Object[] row : documentRepository.countByDocumentType()) {
            docsByType.put(row[0].toString(), (Long) row[1]);
        }

        return DashboardStatsDTO.builder()
                .totalClients(totalClients)
                .totalFamilies(totalFamilies)
                .totalDocuments(totalDocuments)
                .missingDocumentClients(missingDocs)
                .recentClientsThisMonth(recentClients)
                .documentsByType(docsByType)
                .recentActivities(activityService.getRecentActivitiesAsDTO())
                .recentClients(clientService.getRecentClients())
                .build();
    }
}
