package com.oceanview.service;

import com.oceanview.dto.*;
import com.oceanview.exception.BookingConflictException;
import com.oceanview.exception.ResourceNotFoundException;
import com.oceanview.model.*;
import com.oceanview.repository.GuestRepository;
import com.oceanview.repository.ReservationRepository;
import com.oceanview.repository.RoomRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.concurrent.atomic.AtomicInteger;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ReservationService {

    private final ReservationRepository reservationRepository;
    private final GuestRepository guestRepository;
    private final RoomRepository roomRepository;
    private final NotificationService notificationService;

    private final AtomicInteger counter = new AtomicInteger(1);

    public ReservationResponse createReservation(ReservationRequest request, String createdByUsername) {
        if (!request.getCheckOutDate().isAfter(request.getCheckInDate())) {
            throw new IllegalArgumentException("Check-out date must be after check-in date");
        }

        Guest guest = guestRepository.findById(request.getGuestId())
                .orElseThrow(() -> new ResourceNotFoundException("Guest not found: " + request.getGuestId()));

        Room room = roomRepository.findById(request.getRoomId())
                .orElseThrow(() -> new ResourceNotFoundException("Room not found: " + request.getRoomId()));

        List<Reservation> conflicts = reservationRepository.findConflictingReservations(
                room.getId(), request.getCheckInDate(), request.getCheckOutDate());

        if (!conflicts.isEmpty()) {
            throw new BookingConflictException("Room " + room.getRoomNumber() +
                    " is not available for the selected dates.");
        }

        Reservation reservation = Reservation.builder()
                .reservationNumber(generateReservationNumber())
                .guest(guest)
                .room(room)
                .checkInDate(request.getCheckInDate())
                .checkOutDate(request.getCheckOutDate())
                .status(ReservationStatus.CONFIRMED)
                .specialRequests(request.getSpecialRequests())
                .createdByUserId(createdByUsername)
                .build();

        reservation.setTotalAmount(reservation.calculateTotal());

        Reservation saved = reservationRepository.save(reservation);
        notificationService.notifyReservationCreated(saved);

        return toResponse(saved);
    }

    public List<ReservationResponse> getAllReservations() {
        return reservationRepository.findAll().stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
    }

    public ReservationResponse getByReservationNumber(String reservationNumber) {
        Reservation reservation = reservationRepository.findByReservationNumber(reservationNumber)
                .orElseThrow(() -> new ResourceNotFoundException("Reservation not found: " + reservationNumber));
        return toResponse(reservation);
    }

    public ReservationResponse updateReservation(String reservationNumber, UpdateReservationRequest request) {
        Reservation reservation = reservationRepository.findByReservationNumber(reservationNumber)
                .orElseThrow(() -> new ResourceNotFoundException("Reservation not found: " + reservationNumber));

        if (request.getStatus() != null) {
            reservation.setStatus(request.getStatus());
        }
        if (request.getCheckInDate() != null) {
            reservation.setCheckInDate(request.getCheckInDate());
        }
        if (request.getCheckOutDate() != null) {
            reservation.setCheckOutDate(request.getCheckOutDate());
        }
        if (request.getRoomId() != null) {
            Room room = roomRepository.findById(request.getRoomId())
                    .orElseThrow(() -> new ResourceNotFoundException("Room not found: " + request.getRoomId()));
            reservation.setRoom(room);
        }
        if (request.getSpecialRequests() != null) {
            reservation.setSpecialRequests(request.getSpecialRequests());
        }

        reservation.setTotalAmount(reservation.calculateTotal());
        reservation.setUpdatedAt(LocalDateTime.now());

        Reservation updated = reservationRepository.save(reservation);

        if (request.getStatus() == ReservationStatus.CANCELLED) {
            notificationService.notifyReservationCancelled(updated);
        } else {
            notificationService.notifyReservationUpdated(updated);
        }

        return toResponse(updated);
    }

    public void deleteReservation(String reservationNumber) {
        Reservation reservation = reservationRepository.findByReservationNumber(reservationNumber)
                .orElseThrow(() -> new ResourceNotFoundException("Reservation not found: " + reservationNumber));
        reservationRepository.delete(reservation);
    }

    public BillDto calculateBill(String reservationNumber) {
        Reservation reservation = reservationRepository.findByReservationNumber(reservationNumber)
                .orElseThrow(() -> new ResourceNotFoundException("Reservation not found: " + reservationNumber));

        return BillDto.builder()
                .reservationNumber(reservation.getReservationNumber())
                .guestName(reservation.getGuest().getFullName())
                .guestEmail(reservation.getGuest().getEmail())
                .guestContact(reservation.getGuest().getContactNumber())
                .roomNumber(reservation.getRoom().getRoomNumber())
                .roomType(reservation.getRoom().getRoomType().getDisplayName())
                .checkInDate(reservation.getCheckInDate())
                .checkOutDate(reservation.getCheckOutDate())
                .numberOfNights(reservation.getNumberOfNights())
                .nightlyRate(reservation.getRoom().getNightlyRate())
                .totalAmount(reservation.getTotalAmount())
                .status(reservation.getStatus())
                .generatedAt(LocalDateTime.now())
                .build();
    }

    public List<ReservationResponse> searchReservations(SearchRequest request) {
        return reservationRepository.findAll().stream()
                .filter(r -> request.getStatus() == null || r.getStatus() == request.getStatus())
                .filter(r -> request.getRoomType() == null ||
                        (r.getRoom() != null && r.getRoom().getRoomType() == request.getRoomType()))
                .filter(r -> request.getGuestName() == null || request.getGuestName().isBlank() ||
                        (r.getGuest() != null && r.getGuest().getFullName()
                                .toLowerCase().contains(request.getGuestName().toLowerCase())))
                .filter(r -> request.getReservationNumber() == null || request.getReservationNumber().isBlank() ||
                        r.getReservationNumber().contains(request.getReservationNumber()))
                .map(this::toResponse)
                .collect(Collectors.toList());
    }

    public OccupancyReport generateOccupancyReport() {
        long confirmed  = reservationRepository.countByStatus(ReservationStatus.CONFIRMED);
        long checkedIn  = reservationRepository.countByStatus(ReservationStatus.CHECKED_IN);
        long checkedOut = reservationRepository.countByStatus(ReservationStatus.CHECKED_OUT);
        long cancelled  = reservationRepository.countByStatus(ReservationStatus.CANCELLED);

        BigDecimal revenue = reservationRepository.findByStatus(ReservationStatus.CHECKED_OUT)
                .stream()
                .map(r -> r.getTotalAmount() != null ? r.getTotalAmount() : BigDecimal.ZERO)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        return OccupancyReport.builder()
                .totalReservations(confirmed + checkedIn + checkedOut + cancelled)
                .confirmed(confirmed)
                .checkedIn(checkedIn)
                .checkedOut(checkedOut)
                .cancelled(cancelled)
                .totalRevenue(revenue)
                .build();
    }

    private String generateReservationNumber() {
        String date = LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyyyMMdd"));
        return String.format("OVR-%s-%04d", date, counter.getAndIncrement());
    }

    private ReservationResponse toResponse(Reservation r) {
        return ReservationResponse.builder()
                .id(r.getId())
                .reservationNumber(r.getReservationNumber())
                .guestId(r.getGuest() != null ? r.getGuest().getId() : null)
                .guestName(r.getGuest() != null ? r.getGuest().getFullName() : null)
                .guestEmail(r.getGuest() != null ? r.getGuest().getEmail() : null)
                .roomId(r.getRoom() != null ? r.getRoom().getId() : null)
                .roomNumber(r.getRoom() != null ? r.getRoom().getRoomNumber() : null)
                .roomType(r.getRoom() != null ? r.getRoom().getRoomType().getDisplayName() : null)
                .checkInDate(r.getCheckInDate())
                .checkOutDate(r.getCheckOutDate())
                .numberOfNights(r.getNumberOfNights())
                .status(r.getStatus())
                .totalAmount(r.getTotalAmount())
                .specialRequests(r.getSpecialRequests())
                .createdAt(r.getCreatedAt())
                .build();
    }
}
