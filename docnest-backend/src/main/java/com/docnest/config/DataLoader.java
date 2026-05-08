package com.docnest.config;

import com.docnest.entity.Location;
import com.docnest.repository.LocationRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
@RequiredArgsConstructor
@Slf4j
public class DataLoader implements CommandLineRunner {

    private final LocationRepository locationRepository;

    private static final List<String> DEFAULT_LOCATIONS = List.of(
            "Thane", "Navi Mumbai", "Mumbai",
            "Pune", "Nashik", "Aurangabad",
            "Nagpur", "Kolhapur", "Solapur"
    );

    @Override
    public void run(String... args) {
        for (String name : DEFAULT_LOCATIONS) {
            if (!locationRepository.existsByLocationNameIgnoreCase(name)) {
                locationRepository.save(Location.builder().locationName(name).build());
                log.info("Seeded location: {}", name);
            }
        }
        log.info("DocNest started successfully. Locations seeded.");
    }
}
