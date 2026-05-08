package com.docnest.repository;

import com.docnest.entity.FormFieldConfig;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

@Repository
public interface FormFieldConfigRepository extends JpaRepository<FormFieldConfig, Long> {
    List<FormFieldConfig> findAllByOrderByDisplayOrderAsc();
    Optional<FormFieldConfig> findByFieldName(String fieldName);
    boolean existsByFieldName(String fieldName);
}
