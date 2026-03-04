package com.oceanview.dto;

import com.oceanview.model.ReservationStatus;
import com.oceanview.model.RoomType;
import lombok.Data;

import java.time.LocalDate;

@Data
public class SearchRequest {
    private String guestName;
    private String reservationNumber;
    private ReservationStatus status;
    private RoomType roomType;
    private LocalDate fromDate;
    private LocalDate toDate;
}
