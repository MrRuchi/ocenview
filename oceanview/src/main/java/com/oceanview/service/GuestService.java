package com.oceanview.service;

import com.oceanview.dto.GuestRequest;
import com.oceanview.dto.GuestResponse;
import com.oceanview.exception.DuplicateResourceException;
import com.oceanview.exception.ResourceNotFoundException;
import com.oceanview.model.Guest;
import com.oceanview.repository.GuestRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class GuestService {

    private final GuestRepository guestRepository;

    public List<GuestResponse> getAllGuests() {
        return guestRepository.findAll().stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
    }

    public GuestResponse getGuestById(String id) {
        Guest guest = guestRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Guest not found with id: " + id));
        return toResponse(guest);
    }

    public GuestResponse createGuest(GuestRequest request) {
        if (guestRepository.findByEmail(request.getEmail()).isPresent()) {
            throw new DuplicateResourceException("Guest with email already exists: " + request.getEmail());
        }

        Guest guest = Guest.builder()
                .firstName(request.getFirstName())
                .lastName(request.getLastName())
                .email(request.getEmail())
                .contactNumber(request.getContactNumber())
                .address(request.getAddress())
                .build();

        return toResponse(guestRepository.save(guest));
    }

    public GuestResponse updateGuest(String id, GuestRequest request) {
        Guest guest = guestRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Guest not found with id: " + id));

        guest.setFirstName(request.getFirstName());
        guest.setLastName(request.getLastName());
        guest.setEmail(request.getEmail());
        guest.setContactNumber(request.getContactNumber());
        guest.setAddress(request.getAddress());

        return toResponse(guestRepository.save(guest));
    }

    public List<GuestResponse> searchGuests(String query) {
        return guestRepository
                .findByFirstNameContainingIgnoreCaseOrLastNameContainingIgnoreCase(query, query)
                .stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
    }

    public void deleteGuest(String id) {
        if (!guestRepository.existsById(id)) {
            throw new ResourceNotFoundException("Guest not found with id: " + id);
        }
        guestRepository.deleteById(id);
    }

    private GuestResponse toResponse(Guest guest) {
        return GuestResponse.builder()
                .id(guest.getId())
                .firstName(guest.getFirstName())
                .lastName(guest.getLastName())
                .fullName(guest.getFullName())
                .email(guest.getEmail())
                .contactNumber(guest.getContactNumber())
                .address(guest.getAddress())
                .build();
    }
}
