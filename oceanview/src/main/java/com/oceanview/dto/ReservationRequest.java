package com.oceanview.dto;

import lombok.Data;

import java.time.LocalDate;

@Data
public class ReservationRequest {
    private String guestId;
    private String roomId;
    private LocalDate checkInDate;
    private LocalDate checkOutDate;
    private String specialRequests;
}
