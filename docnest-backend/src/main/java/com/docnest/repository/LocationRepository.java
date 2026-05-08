package com.docnest.repository;

import com.docnest.entity.Location;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface LocationRepository extends JpaRepository<Location, Long> {
    Optional<Location> findByLocationNameIgnoreCase(String locationName);
    boolean existsByLocationNameIgnoreCase(String locationName);
}
