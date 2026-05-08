package com.docnest.repository;

import com.docnest.entity.ActivityLog;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ActivityLogRepository extends JpaRepository<ActivityLog, Long> {

    List<ActivityLog> findAllByOrderByTimestampDesc();

    List<ActivityLog> findTop10ByOrderByTimestampDesc();

    List<ActivityLog> findByEntityTypeAndEntityId(String entityType, Long entityId);
}
