package com.docnest.repository;

import com.docnest.entity.SystemPreference;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.Optional;

@Repository
public interface SystemPreferenceRepository extends JpaRepository<SystemPreference, Long> {
    Optional<SystemPreference> findByPrefKey(String prefKey);
}
