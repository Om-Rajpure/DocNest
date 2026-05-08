package com.docnest.repository;

import com.docnest.entity.FamilyMember;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface FamilyMemberRepository extends JpaRepository<FamilyMember, Long> {

    List<FamilyMember> findByClientId(Long clientId);

    long countByClientId(Long clientId);

    void deleteByClientId(Long clientId);
}
