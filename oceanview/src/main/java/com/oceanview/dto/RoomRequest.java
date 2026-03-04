package com.oceanview.dto;

import com.oceanview.model.RoomType;
import lombok.Data;

@Data
public class RoomRequest {
    private String roomNumber;
    private RoomType roomType;
    private int floorNumber;
}
