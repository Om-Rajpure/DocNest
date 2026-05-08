package com.docnest.service;

import com.docnest.dto.FamilyMemberDTO;
import com.docnest.dto.FamilyTreeNodeDTO;
import com.docnest.entity.Client;
import com.docnest.entity.FamilyMember;
import com.docnest.exception.ResourceNotFoundException;
import com.docnest.repository.ClientRepository;
import com.docnest.repository.DocumentRepository;
import com.docnest.repository.FamilyMemberRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class FamilyService {

    private final FamilyMemberRepository familyMemberRepository;
    private final ClientRepository clientRepository;
    private final DocumentRepository documentRepository;
    private final ActivityService activityService;

    private static final DateTimeFormatter DOB_FMT = DateTimeFormatter.ofPattern("dd MMM yyyy");

    @Transactional
    public FamilyMemberDTO addFamilyMember(FamilyMemberDTO dto) {
        Client client = clientRepository.findById(dto.getClientId())
                .orElseThrow(() -> new ResourceNotFoundException("Client not found: " + dto.getClientId()));

        FamilyMember member = FamilyMember.builder()
                .client(client)
                .memberName(dto.getMemberName())
                .relation(dto.getRelation())
                .dob(dto.getDob())
                .gender(dto.getGender())
                .mobile(dto.getMobile())
                .email(dto.getEmail())
                .build();

        FamilyMember saved = familyMemberRepository.save(member);
        activityService.log("FAMILY_MEMBER_ADDED",
                dto.getRelation() + " '" + dto.getMemberName() + "' added for client #" + dto.getClientId(),
                "CLIENT", dto.getClientId());
        return toDTO(saved);
    }

    @Transactional
    public FamilyMemberDTO updateFamilyMember(Long id, FamilyMemberDTO dto) {
        FamilyMember member = familyMemberRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Family member not found: " + id));

        member.setMemberName(dto.getMemberName());
        member.setRelation(dto.getRelation());
        member.setDob(dto.getDob());
        member.setGender(dto.getGender());
        member.setMobile(dto.getMobile());
        member.setEmail(dto.getEmail());

        FamilyMember saved = familyMemberRepository.save(member);
        activityService.log("FAMILY_MEMBER_UPDATED",
                "Family member updated: " + saved.getMemberName(),
                "CLIENT", saved.getClient().getId());
        return toDTO(saved);
    }

    @Transactional
    public void deleteFamilyMember(Long id) {
        FamilyMember member = familyMemberRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Family member not found: " + id));
        Long clientId = member.getClient().getId();
        String name = member.getMemberName();
        familyMemberRepository.delete(member);
        activityService.log("FAMILY_MEMBER_REMOVED",
                "Family member removed: " + name, "CLIENT", clientId);
    }

    public List<FamilyMemberDTO> getFamilyMembers(Long clientId) {
        return familyMemberRepository.findByClientId(clientId)
                .stream().map(this::toDTO).collect(Collectors.toList());
    }

    /**
     * Builds react-d3-tree compatible node structure.
     * Root = the client, children = all family members.
     */
    public FamilyTreeNodeDTO getFamilyTree(Long clientId) {
        Client client = clientRepository.findById(clientId)
                .orElseThrow(() -> new ResourceNotFoundException("Client not found: " + clientId));

        List<FamilyMember> members = familyMemberRepository.findByClientId(clientId);

        List<FamilyTreeNodeDTO> childNodes = members.stream().map(m ->
            FamilyTreeNodeDTO.builder()
                .name(m.getMemberName())
                .attributes(FamilyTreeNodeDTO.NodeAttributes.builder()
                        .relation(m.getRelation())
                        .gender(m.getGender())
                        .mobile(m.getMobile())
                        .dob(m.getDob() != null ? m.getDob().format(DOB_FMT) : null)
                        .memberId(m.getId())
                        .build())
                .children(new ArrayList<>())
                .build()
        ).collect(Collectors.toList());

        return FamilyTreeNodeDTO.builder()
                .name(client.getFirstName() + " " + client.getLastName())
                .attributes(FamilyTreeNodeDTO.NodeAttributes.builder()
                        .relation("Head")
                        .gender(client.getGender())
                        .mobile(client.getMobile())
                        .dob(client.getDob() != null ? client.getDob().format(DOB_FMT) : null)
                        .memberId(null)
                        .build())
                .children(childNodes)
                .build();
    }

    private FamilyMemberDTO toDTO(FamilyMember m) {
        long docCount = documentRepository.countByOwnerTypeAndOwnerId("FAMILY_MEMBER", m.getId());
        return FamilyMemberDTO.builder()
                .id(m.getId())
                .clientId(m.getClient().getId())
                .memberName(m.getMemberName())
                .relation(m.getRelation())
                .dob(m.getDob())
                .gender(m.getGender())
                .mobile(m.getMobile())
                .email(m.getEmail())
                .documentCount(docCount)
                .build();
    }
}
