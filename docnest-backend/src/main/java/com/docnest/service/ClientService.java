package com.docnest.service;

import com.docnest.dto.ClientDTO;
import com.docnest.entity.Client;
import com.docnest.entity.Location;
import com.docnest.exception.ResourceNotFoundException;
import com.docnest.repository.ClientRepository;
import com.docnest.repository.DocumentRepository;
import com.docnest.repository.FamilyMemberRepository;
import com.docnest.repository.LocationRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.*;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.Period;
import java.util.Arrays;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ClientService {

    private final ClientRepository clientRepository;
    private final LocationRepository locationRepository;
    private final FamilyMemberRepository familyMemberRepository;
    private final DocumentRepository documentRepository;
    private final ActivityService activityService;

    private static final List<String> REQUIRED_DOC_TYPES =
            Arrays.asList("AADHAR", "PAN", "DRIVING_LICENSE", "ELECTRICITY_BILL");

    private void validateDob(LocalDate dob) {
        if (dob == null) return;
        if (dob.isAfter(LocalDate.now())) throw new IllegalArgumentException("Date of birth cannot be in the future");
        int age = Period.between(dob, LocalDate.now()).getYears();
        if (age < 18) throw new IllegalArgumentException("Client must be at least 18 years old");
        if (age > 100) throw new IllegalArgumentException("Please enter a realistic date of birth");
    }

    @Transactional
    public ClientDTO addClient(ClientDTO dto) {
        validateDob(dto.getDob());
        Location location = locationRepository.findById(dto.getLocationId())
                .orElseThrow(() -> new ResourceNotFoundException("Location not found"));

        Client client = Client.builder()
                .firstName(dto.getFirstName())
                .lastName(dto.getLastName())
                .mobile(dto.getMobile())
                .dob(dto.getDob())
                .gender(dto.getGender())
                .address(dto.getAddress())
                .email(dto.getEmail())
                .location(location)
                .build();

        Client saved = clientRepository.save(client);
        activityService.log("CLIENT_ADDED",
                "New client added: " + saved.getFirstName() + " " + saved.getLastName(),
                "CLIENT", saved.getId());
        return toDTO(saved);
    }

    @Transactional
    public ClientDTO updateClient(Long id, ClientDTO dto) {
        validateDob(dto.getDob());
        Client client = clientRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Client not found with id: " + id));

        Location location = locationRepository.findById(dto.getLocationId())
                .orElseThrow(() -> new ResourceNotFoundException("Location not found"));

        client.setFirstName(dto.getFirstName());
        client.setLastName(dto.getLastName());
        client.setMobile(dto.getMobile());
        client.setDob(dto.getDob());
        client.setGender(dto.getGender());
        client.setAddress(dto.getAddress());
        client.setEmail(dto.getEmail());
        client.setLocation(location);

        Client saved = clientRepository.save(client);
        activityService.log("CLIENT_UPDATED",
                "Client updated: " + saved.getFirstName() + " " + saved.getLastName(),
                "CLIENT", saved.getId());
        return toDTO(saved);
    }

    @Transactional
    public void deleteClient(Long id) {
        Client client = clientRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Client not found with id: " + id));
        String name = client.getFirstName() + " " + client.getLastName();
        clientRepository.delete(client);
        activityService.log("CLIENT_DELETED", "Client deleted: " + name, "CLIENT", id);
    }

    public ClientDTO getClientById(Long id) {
        Client client = clientRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Client not found with id: " + id));
        return toDTO(client);
    }

    public Page<ClientDTO> searchClients(String query, Long locationId, int page, int size) {
        Pageable pageable = PageRequest.of(page, size, Sort.by("createdAt").descending());
        Page<Client> clients = clientRepository.searchClients(
                (query == null || query.isBlank()) ? null : query,
                locationId,
                pageable);
        return clients.map(this::toDTO);
    }

    public List<ClientDTO> getRecentClients() {
        return clientRepository.findTop5ByOrderByCreatedAtDesc()
                .stream().map(this::toDTO).collect(Collectors.toList());
    }

    public ClientDTO toDTO(Client client) {
        long docCount = documentRepository.countByOwnerTypeAndOwnerId("CLIENT", client.getId());
        long familyCount = familyMemberRepository.countByClientId(client.getId());

        Set<String> uploadedTypes = documentRepository.findByOwnerTypeAndOwnerId("CLIENT", client.getId())
                .stream().map(d -> d.getDocumentType()).collect(Collectors.toSet());
        boolean hasMissing = !uploadedTypes.containsAll(REQUIRED_DOC_TYPES);

        return ClientDTO.builder()
                .id(client.getId())
                .firstName(client.getFirstName())
                .lastName(client.getLastName())
                .mobile(client.getMobile())
                .dob(client.getDob())
                .gender(client.getGender())
                .address(client.getAddress())
                .email(client.getEmail())
                .locationId(client.getLocation() != null ? client.getLocation().getId() : null)
                .locationName(client.getLocation() != null ? client.getLocation().getLocationName() : null)
                .createdAt(client.getCreatedAt())
                .familyMemberCount(familyCount)
                .documentCount(docCount)
                .hasMissingDocuments(hasMissing)
                .build();
    }
}
