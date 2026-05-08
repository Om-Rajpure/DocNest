package com.docnest.controller;

import com.docnest.dto.FamilyMemberDTO;
import com.docnest.dto.FamilyTreeNodeDTO;
import com.docnest.service.FamilyService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/family")
@RequiredArgsConstructor

public class FamilyController {

    private final FamilyService familyService;

    @PostMapping
    public ResponseEntity<FamilyMemberDTO> addMember(@RequestBody FamilyMemberDTO dto) {
        return ResponseEntity.ok(familyService.addFamilyMember(dto));
    }

    @PutMapping("/{id}")
    public ResponseEntity<FamilyMemberDTO> updateMember(@PathVariable Long id,
                                                         @RequestBody FamilyMemberDTO dto) {
        return ResponseEntity.ok(familyService.updateFamilyMember(id, dto));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteMember(@PathVariable Long id) {
        familyService.deleteFamilyMember(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/client/{clientId}")
    public ResponseEntity<List<FamilyMemberDTO>> getMembers(@PathVariable Long clientId) {
        return ResponseEntity.ok(familyService.getFamilyMembers(clientId));
    }

    @GetMapping("/tree/{clientId}")
    public ResponseEntity<FamilyTreeNodeDTO> getTree(@PathVariable Long clientId) {
        return ResponseEntity.ok(familyService.getFamilyTree(clientId));
    }
}
