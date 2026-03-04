package com.oceanview.controller;

import com.oceanview.dto.OccupancyReport;
import com.oceanview.service.ReservationService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/admin")
@RequiredArgsConstructor
@PreAuthorize("hasRole('ADMIN')")
public class AdminController {

    private final ReservationService reservationService;

    @GetMapping("/reports/occupancy")
    public ResponseEntity<OccupancyReport> getOccupancyReport() {
        return ResponseEntity.ok(reservationService.generateOccupancyReport());
    }
}
