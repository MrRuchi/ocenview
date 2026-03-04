package com.oceanview.dto;

import lombok.Data;
import lombok.Builder;

import java.math.BigDecimal;

@Data
@Builder
public class OccupancyReport {
    private long totalReservations;
    private long confirmed;
    private long checkedIn;
    private long checkedOut;
    private long cancelled;
    private BigDecimal totalRevenue;
}
