package com.docnest.service;

import com.docnest.dto.DashboardStatsDTO.ActivityLogDTO;
import com.docnest.entity.ActivityLog;
import com.docnest.repository.ActivityLogRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ActivityService {

    private final ActivityLogRepository activityLogRepository;

    private static final DateTimeFormatter FORMATTER =
        DateTimeFormatter.ofPattern("dd MMM yyyy, hh:mm a");

    public void log(String action, String description, String entityType, Long entityId) {
        ActivityLog log = ActivityLog.builder()
                .action(action)
                .description(description)
                .entityType(entityType)
                .entityId(entityId)
                .build();
        activityLogRepository.save(log);
    }

    public List<ActivityLog> getAllActivities() {
        return activityLogRepository.findAllByOrderByTimestampDesc();
    }

    public List<ActivityLog> getRecentActivities() {
        return activityLogRepository.findTop10ByOrderByTimestampDesc();
    }

    public List<ActivityLogDTO> getRecentActivitiesAsDTO() {
        return getRecentActivities().stream().map(log -> ActivityLogDTO.builder()
                .id(log.getId())
                .action(log.getAction())
                .description(log.getDescription())
                .entityType(log.getEntityType())
                .entityId(log.getEntityId())
                .timestamp(log.getTimestamp() != null
                        ? log.getTimestamp().format(FORMATTER) : "")
                .build()
        ).collect(Collectors.toList());
    }

    public List<ActivityLog> getActivitiesForEntity(String entityType, Long entityId) {
        return activityLogRepository.findByEntityTypeAndEntityId(entityType, entityId);
    }
}
