package com.oceanview.controller;

import com.oceanview.dto.*;
import com.oceanview.service.ReservationService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/reservations")
@RequiredArgsConstructor
public class ReservationController {

    private final ReservationService reservationService;

    @GetMapping
    public ResponseEntity<List<ReservationResponse>> getAllReservations() {
        return ResponseEntity.ok(reservationService.getAllReservations());
    }

    @PostMapping
    public ResponseEntity<ReservationResponse> createReservation(
            @RequestBody ReservationRequest request,
            @AuthenticationPrincipal UserDetails userDetails) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(reservationService.createReservation(request, userDetails.getUsername()));
    }

    @GetMapping("/{reservationNumber}")
    public ResponseEntity<ReservationResponse> getReservation(@PathVariable String reservationNumber) {
        return ResponseEntity.ok(reservationService.getByReservationNumber(reservationNumber));
    }

    @GetMapping("/{reservationNumber}/bill")
    public ResponseEntity<BillDto> getBill(@PathVariable String reservationNumber) {
        return ResponseEntity.ok(reservationService.calculateBill(reservationNumber));
    }

    @PutMapping("/{reservationNumber}")
    public ResponseEntity<ReservationResponse> updateReservation(
            @PathVariable String reservationNumber,
            @RequestBody UpdateReservationRequest request) {
        return ResponseEntity.ok(reservationService.updateReservation(reservationNumber, request));
    }

    @DeleteMapping("/{reservationNumber}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> deleteReservation(@PathVariable String reservationNumber) {
        reservationService.deleteReservation(reservationNumber);
        return ResponseEntity.noContent().build();
    }

    @PostMapping("/search")
    public ResponseEntity<List<ReservationResponse>> searchReservations(@RequestBody SearchRequest request) {
        return ResponseEntity.ok(reservationService.searchReservations(request));
    }
}
