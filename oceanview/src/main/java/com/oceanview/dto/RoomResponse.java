package com.oceanview.dto;

import com.oceanview.model.RoomType;
import lombok.Data;
import lombok.Builder;

import java.math.BigDecimal;

@Data
@Builder
public class RoomResponse {
    private String id;
    private String roomNumber;
    private RoomType roomType;
    private String roomTypeDisplay;
    private int floorNumber;
    private int capacity;
    private BigDecimal nightlyRate;
    private String amenities;
    private boolean isAvailable;
}
