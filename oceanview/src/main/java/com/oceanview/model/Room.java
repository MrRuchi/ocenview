package com.oceanview.model;

import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import lombok.Builder;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.index.Indexed;

import java.math.BigDecimal;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Document(collection = "rooms")
public class Room {

    @Id
    private String id;

    @Indexed(unique = true)
    private String roomNumber;

    private RoomType roomType;

    private int floorNumber;

    private int capacity;

    private BigDecimal nightlyRate;

    private String amenities;

    private boolean isAvailable = true;
}
