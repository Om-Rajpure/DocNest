package com.docnest.controller;

import com.docnest.entity.ActivityLog;
import com.docnest.service.ActivityService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/activity")
@RequiredArgsConstructor

public class ActivityController {

    private final ActivityService activityService;

    @GetMapping
    public ResponseEntity<List<ActivityLog>> getAll() {
        return ResponseEntity.ok(activityService.getAllActivities());
    }

    @GetMapping("/recent")
    public ResponseEntity<List<ActivityLog>> getRecent() {
        return ResponseEntity.ok(activityService.getRecentActivities());
    }

    @GetMapping("/entity/{type}/{id}")
    public ResponseEntity<List<ActivityLog>> getForEntity(
            @PathVariable String type, @PathVariable Long id) {
        return ResponseEntity.ok(activityService.getActivitiesForEntity(type, id));
    }
}
