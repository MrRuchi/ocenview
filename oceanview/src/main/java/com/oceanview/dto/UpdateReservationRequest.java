package com.oceanview.dto;

import com.oceanview.model.ReservationStatus;
import lombok.Data;

import java.time.LocalDate;

@Data
public class UpdateReservationRequest {
    private ReservationStatus status;
    private LocalDate checkInDate;
    private LocalDate checkOutDate;
    private String roomId;
    private String specialRequests;
}
