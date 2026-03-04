package com.oceanview.dto;

import com.oceanview.model.ReservationStatus;
import lombok.Data;
import lombok.Builder;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
@Builder
public class BillDto {
    private String reservationNumber;
    private String guestName;
    private String guestEmail;
    private String guestContact;
    private String roomNumber;
    private String roomType;
    private LocalDate checkInDate;
    private LocalDate checkOutDate;
    private long numberOfNights;
    private BigDecimal nightlyRate;
    private BigDecimal totalAmount;
    private ReservationStatus status;
    private LocalDateTime generatedAt;
}
