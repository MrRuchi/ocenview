package com.oceanview.controller;

import org.springframework.security.access.prepost.PreAuthorize;

import com.oceanview.dto.GuestRequest;
import com.oceanview.dto.GuestResponse;
import com.oceanview.service.GuestService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/guests")
@RequiredArgsConstructor
public class GuestController {

    private final GuestService guestService;

    @GetMapping
    public ResponseEntity<List<GuestResponse>> getAllGuests() {
        return ResponseEntity.ok(guestService.getAllGuests());
    }

    @GetMapping("/{id}")
    public ResponseEntity<GuestResponse> getGuest(@PathVariable String id) {
        return ResponseEntity.ok(guestService.getGuestById(id));
    }

    @PostMapping
    public ResponseEntity<GuestResponse> createGuest(@RequestBody GuestRequest request) {
        return ResponseEntity.ok(guestService.createGuest(request));
    }

    @PutMapping("/{id}")
    public ResponseEntity<GuestResponse> updateGuest(@PathVariable String id,
            @RequestBody GuestRequest request) {
        return ResponseEntity.ok(guestService.updateGuest(id, request));
    }

    @GetMapping("/search")
    public ResponseEntity<List<GuestResponse>> searchGuests(@RequestParam String query) {
        return ResponseEntity.ok(guestService.searchGuests(query));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> deleteGuest(@PathVariable String id) {
        guestService.deleteGuest(id);
        return ResponseEntity.noContent().build();
    }
}
