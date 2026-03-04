package com.oceanview.observer;

import com.oceanview.model.Reservation;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Component;

@Component
public class AuditLogObserver implements ReservationObserver {

    private static final Logger logger = LoggerFactory.getLogger(AuditLogObserver.class);

    @Override
    public void onReservationCreated(Reservation reservation) {
        logger.info("[AUDIT] Reservation CREATED: {} | Guest: {} | Room: {} | CheckIn: {} | CheckOut: {} | Total: LKR {}",
                reservation.getReservationNumber(),
                reservation.getGuest() != null ? reservation.getGuest().getFullName() : "N/A",
                reservation.getRoom() != null ? reservation.getRoom().getRoomNumber() : "N/A",
                reservation.getCheckInDate(),
                reservation.getCheckOutDate(),
                reservation.getTotalAmount());
    }

    @Override
    public void onReservationUpdated(Reservation reservation) {
        logger.info("[AUDIT] Reservation UPDATED: {} | Status: {} | UpdatedAt: {}",
                reservation.getReservationNumber(),
                reservation.getStatus(),
                reservation.getUpdatedAt());
    }

    @Override
    public void onReservationCancelled(Reservation reservation) {
        logger.info("[AUDIT] Reservation CANCELLED: {} | Guest: {} | Room: {}",
                reservation.getReservationNumber(),
                reservation.getGuest() != null ? reservation.getGuest().getFullName() : "N/A",
                reservation.getRoom() != null ? reservation.getRoom().getRoomNumber() : "N/A");
    }
}
