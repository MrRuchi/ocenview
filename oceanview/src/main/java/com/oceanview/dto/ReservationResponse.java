package com.oceanview.dto;

import com.oceanview.model.ReservationStatus;
import lombok.Data;
import lombok.Builder;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
@Builder
public class ReservationResponse {
    private String id;
    private String reservationNumber;
    private String guestId;
    private String guestName;
    private String guestEmail;
    private String roomId;
    private String roomNumber;
    private String roomType;
    private LocalDate checkInDate;
    private LocalDate checkOutDate;
    private long numberOfNights;
    private ReservationStatus status;
    private BigDecimal totalAmount;
    private String specialRequests;
    private LocalDateTime createdAt;
}
