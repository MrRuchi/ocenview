package com.oceanview.repository;

import com.oceanview.model.Reservation;
import com.oceanview.model.ReservationStatus;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Repository
public interface ReservationRepository extends MongoRepository<Reservation, String> {

    Optional<Reservation> findByReservationNumber(String reservationNumber);

    List<Reservation> findByStatus(ReservationStatus status);

    List<Reservation> findByGuestId(String guestId);

    long countByStatus(ReservationStatus status);

    @Query("{ 'room.$id': { $oid: ?0 }, 'checkInDate': { $lt: ?2 }, 'checkOutDate': { $gt: ?1 }, 'status': { $nin: ['CANCELLED'] } }")
    List<Reservation> findConflictingReservations(String roomId, LocalDate checkIn, LocalDate checkOut);
}
