package com.oceanview.model;

import java.math.BigDecimal;

public enum RoomType {
    STANDARD("Standard Room", new BigDecimal("8000")),
    DELUXE("Deluxe Room", new BigDecimal("12000")),
    SUITE("Suite", new BigDecimal("18000")),
    BEACHFRONT_VILLA("Beachfront Villa", new BigDecimal("25000"));

    private final String displayName;
    private final BigDecimal nightlyRate;

    RoomType(String displayName, BigDecimal nightlyRate) {
        this.displayName = displayName;
        this.nightlyRate = nightlyRate;
    }

    public String getDisplayName() {
        return displayName;
    }

    public BigDecimal getNightlyRate() {
        return nightlyRate;
    }
}
