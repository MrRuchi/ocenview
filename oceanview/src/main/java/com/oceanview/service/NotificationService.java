package com.oceanview.service;

import com.oceanview.model.Reservation;
import com.oceanview.observer.ReservationObserver;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class NotificationService {

    private final List<ReservationObserver> observers;

    public void notifyReservationCreated(Reservation reservation) {
        observers.forEach(o -> o.onReservationCreated(reservation));
    }

    public void notifyReservationUpdated(Reservation reservation) {
        observers.forEach(o -> o.onReservationUpdated(reservation));
    }

    public void notifyReservationCancelled(Reservation reservation) {
        observers.forEach(o -> o.onReservationCancelled(reservation));
    }
}
