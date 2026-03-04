package com.oceanview.model;

import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import lombok.Builder;
import org.springframework.data.annotation.Id;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.DBRef;
import org.springframework.data.mongodb.core.index.Indexed;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.temporal.ChronoUnit;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Document(collection = "reservations")
public class Reservation {

    @Id
    private String id;

    @Indexed(unique = true)
    private String reservationNumber;

    @DBRef
    private Guest guest;

    @DBRef
    private Room room;

    private LocalDate checkInDate;

    private LocalDate checkOutDate;

    private ReservationStatus status;

    private BigDecimal totalAmount;

    private String createdByUserId;

    private String specialRequests;

    @CreatedDate
    private LocalDateTime createdAt;

    private LocalDateTime updatedAt;

    public long getNumberOfNights() {
        if (checkInDate != null && checkOutDate != null) {
            return ChronoUnit.DAYS.between(checkInDate, checkOutDate);
        }
        return 0;
    }

    public BigDecimal calculateTotal() {
        if (room != null && room.getNightlyRate() != null) {
            return room.getNightlyRate().multiply(BigDecimal.valueOf(getNumberOfNights()));
        }
        return BigDecimal.ZERO;
    }
}
