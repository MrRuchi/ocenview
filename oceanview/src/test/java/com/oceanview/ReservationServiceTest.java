package com.oceanview;

import com.oceanview.dto.*;
import com.oceanview.exception.BookingConflictException;
import com.oceanview.exception.ResourceNotFoundException;
import com.oceanview.model.*;
import com.oceanview.repository.*;
import com.oceanview.service.NotificationService;
import com.oceanview.service.ReservationService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
@DisplayName("ReservationService — Unit Tests with Mockito")
class ReservationServiceTest {

    @Mock ReservationRepository reservationRepository;
    @Mock GuestRepository       guestRepository;
    @Mock RoomRepository        roomRepository;
    @Mock NotificationService   notificationService;

    @InjectMocks ReservationService reservationService;

    private Guest testGuest;
    private Room  testRoom;

    @BeforeEach
    void setUp() {
        testGuest = new Guest();
        testGuest.setId("guest001");
        testGuest.setFirstName("John");
        testGuest.setLastName("Perera");
        testGuest.setEmail("john@test.com");
        testGuest.setContactNumber("0771234567");

        testRoom = new Room();
        testRoom.setId("room001");
        testRoom.setRoomNumber("D201");
        testRoom.setRoomType(RoomType.DELUXE);
        testRoom.setNightlyRate(new BigDecimal("12000"));
        testRoom.setCapacity(2);
        testRoom.setAvailable(true);
    }

    // ─── TC15: Successful reservation creation ────────────────────────────────
    @Test
    @DisplayName("TC15 — Create reservation successfully with no conflicts")
    void testCreateReservationSuccess() {
        ReservationRequest request = new ReservationRequest();
        request.setGuestId("guest001");
        request.setRoomId("room001");
        request.setCheckInDate(LocalDate.of(2026, 3, 1));
        request.setCheckOutDate(LocalDate.of(2026, 3, 4));

        when(guestRepository.findById("guest001")).thenReturn(Optional.of(testGuest));
        when(roomRepository.findById("room001")).thenReturn(Optional.of(testRoom));
        when(reservationRepository.findConflictingReservations(any(), any(), any()))
                .thenReturn(List.of());
        when(reservationRepository.save(any()))
                .thenAnswer(inv -> inv.getArgument(0));

        ReservationResponse response =
                reservationService.createReservation(request, "staff");

        assertNotNull(response, "Response must not be null");
        assertEquals("D201", response.getRoomNumber());
        assertEquals(3L, response.getNumberOfNights());
        assertEquals(new BigDecimal("36000"), response.getTotalAmount());
        assertEquals(ReservationStatus.CONFIRMED, response.getStatus());
    }

    // ─── TC16: Observer notified on creation ──────────────────────────────────
    @Test
    @DisplayName("TC16 — Observer (NotificationService) is notified on reservation creation")
    void testObserverNotifiedOnCreate() {
        ReservationRequest request = new ReservationRequest();
        request.setGuestId("guest001");
        request.setRoomId("room001");
        request.setCheckInDate(LocalDate.of(2026, 3, 1));
        request.setCheckOutDate(LocalDate.of(2026, 3, 3));

        when(guestRepository.findById("guest001")).thenReturn(Optional.of(testGuest));
        when(roomRepository.findById("room001")).thenReturn(Optional.of(testRoom));
        when(reservationRepository.findConflictingReservations(any(), any(), any()))
                .thenReturn(List.of());
        when(reservationRepository.save(any()))
                .thenAnswer(inv -> inv.getArgument(0));

        reservationService.createReservation(request, "staff");

        verify(notificationService, times(1)).notifyReservationCreated(any());
    }

    // ─── TC17: Booking conflict ───────────────────────────────────────────────
    @Test
    @DisplayName("TC17 — Booking conflict throws BookingConflictException")
    void testCreateReservationConflict() {
        ReservationRequest request = new ReservationRequest();
        request.setGuestId("guest001");
        request.setRoomId("room001");
        request.setCheckInDate(LocalDate.of(2026, 3, 1));
        request.setCheckOutDate(LocalDate.of(2026, 3, 4));

        when(guestRepository.findById("guest001")).thenReturn(Optional.of(testGuest));
        when(roomRepository.findById("room001")).thenReturn(Optional.of(testRoom));
        when(reservationRepository.findConflictingReservations(any(), any(), any()))
                .thenReturn(List.of(new Reservation()));

        assertThrows(BookingConflictException.class,
                () -> reservationService.createReservation(request, "staff"),
                "Conflicting reservation must throw BookingConflictException");

        verify(reservationRepository, never()).save(any());
    }

    // ─── TC18: Invalid dates ──────────────────────────────────────────────────
    @Test
    @DisplayName("TC18 — Check-out before check-in throws IllegalArgumentException")
    void testInvalidDatesThrows() {
        ReservationRequest request = new ReservationRequest();
        request.setGuestId("guest001");
        request.setRoomId("room001");
        request.setCheckInDate(LocalDate.of(2026, 3, 5));
        request.setCheckOutDate(LocalDate.of(2026, 3, 1));

        assertThrows(IllegalArgumentException.class,
                () -> reservationService.createReservation(request, "staff"),
                "Check-out before check-in must throw IllegalArgumentException");
    }

    // ─── TC19: Same day check-in and check-out ────────────────────────────────
    @Test
    @DisplayName("TC19 — Same-day check-in and check-out throws IllegalArgumentException")
    void testSameDayThrows() {
        ReservationRequest request = new ReservationRequest();
        request.setGuestId("guest001");
        request.setRoomId("room001");
        request.setCheckInDate(LocalDate.of(2026, 3, 1));
        request.setCheckOutDate(LocalDate.of(2026, 3, 1));

        assertThrows(IllegalArgumentException.class,
                () -> reservationService.createReservation(request, "staff"),
                "Same-day reservation must throw IllegalArgumentException");
    }

    // ─── TC20: Guest not found ────────────────────────────────────────────────
    @Test
    @DisplayName("TC20 — Guest not found throws ResourceNotFoundException")
    void testGuestNotFound() {
        ReservationRequest request = new ReservationRequest();
        request.setGuestId("invalid_guest");
        request.setRoomId("room001");
        request.setCheckInDate(LocalDate.of(2026, 3, 1));
        request.setCheckOutDate(LocalDate.of(2026, 3, 4));

        when(guestRepository.findById("invalid_guest")).thenReturn(Optional.empty());

        assertThrows(ResourceNotFoundException.class,
                () -> reservationService.createReservation(request, "staff"),
                "Invalid guest ID must throw ResourceNotFoundException");
    }

    // ─── TC21: Room not found ─────────────────────────────────────────────────
    @Test
    @DisplayName("TC21 — Room not found throws ResourceNotFoundException")
    void testRoomNotFound() {
        ReservationRequest request = new ReservationRequest();
        request.setGuestId("guest001");
        request.setRoomId("invalid_room");
        request.setCheckInDate(LocalDate.of(2026, 3, 1));
        request.setCheckOutDate(LocalDate.of(2026, 3, 4));

        when(guestRepository.findById("guest001")).thenReturn(Optional.of(testGuest));
        when(roomRepository.findById("invalid_room")).thenReturn(Optional.empty());

        assertThrows(ResourceNotFoundException.class,
                () -> reservationService.createReservation(request, "staff"),
                "Invalid room ID must throw ResourceNotFoundException");
    }

    // ─── TC22: Bill calculation ───────────────────────────────────────────────
    @Test
    @DisplayName("TC22 — Bill: 3 nights x LKR 12,000 = LKR 36,000")
    void testBillCalculation() {
        Reservation reservation = new Reservation();
        reservation.setReservationNumber("OVR-20260301-0001");
        reservation.setGuest(testGuest);
        reservation.setRoom(testRoom);
        reservation.setCheckInDate(LocalDate.of(2026, 3, 1));
        reservation.setCheckOutDate(LocalDate.of(2026, 3, 4));
        reservation.setStatus(ReservationStatus.CONFIRMED);
        reservation.setTotalAmount(new BigDecimal("36000"));

        when(reservationRepository.findByReservationNumber("OVR-20260301-0001"))
                .thenReturn(Optional.of(reservation));

        BillDto bill = reservationService.calculateBill("OVR-20260301-0001");

        assertEquals(3L, bill.getNumberOfNights(), "Must be 3 nights");
        assertEquals(new BigDecimal("36000"), bill.getTotalAmount(), "Total must be LKR 36,000");
        assertEquals("John Perera", bill.getGuestName(), "Guest name must match");
        assertEquals("D201", bill.getRoomNumber(), "Room number must match");
        assertEquals(new BigDecimal("12000"), bill.getNightlyRate(), "Nightly rate must be LKR 12,000");
    }

    // ─── TC23: Bill — reservation not found ───────────────────────────────────
    @Test
    @DisplayName("TC23 — calculateBill with invalid number throws ResourceNotFoundException")
    void testBillNotFound() {
        when(reservationRepository.findByReservationNumber("INVALID"))
                .thenReturn(Optional.empty());

        assertThrows(ResourceNotFoundException.class,
                () -> reservationService.calculateBill("INVALID"),
                "Invalid reservation number must throw ResourceNotFoundException");
    }

    // ─── TC24: Delete reservation ─────────────────────────────────────────────
    @Test
    @DisplayName("TC24 — Delete reservation calls repository delete exactly once")
    void testDeleteReservation() {
        Reservation reservation = new Reservation();
        reservation.setReservationNumber("OVR-20260301-0001");

        when(reservationRepository.findByReservationNumber("OVR-20260301-0001"))
                .thenReturn(Optional.of(reservation));

        reservationService.deleteReservation("OVR-20260301-0001");

        verify(reservationRepository, times(1)).delete(reservation);
    }

    // ─── TC25: Delete non-existent reservation ────────────────────────────────
    @Test
    @DisplayName("TC25 — Delete non-existent reservation throws ResourceNotFoundException")
    void testDeleteNotFound() {
        when(reservationRepository.findByReservationNumber("INVALID"))
                .thenReturn(Optional.empty());

        assertThrows(ResourceNotFoundException.class,
                () -> reservationService.deleteReservation("INVALID"),
                "Deleting non-existent reservation must throw ResourceNotFoundException");
    }

    // ─── TC26: Get all reservations ───────────────────────────────────────────
    @Test
    @DisplayName("TC26 — getAllReservations returns list from repository")
    void testGetAllReservations() {
        Reservation r1 = new Reservation();
        r1.setGuest(testGuest);
        r1.setRoom(testRoom);
        r1.setCheckInDate(LocalDate.of(2026, 3, 1));
        r1.setCheckOutDate(LocalDate.of(2026, 3, 3));
        r1.setStatus(ReservationStatus.CONFIRMED);
        r1.setTotalAmount(new BigDecimal("24000"));

        when(reservationRepository.findAll()).thenReturn(List.of(r1));

        List<ReservationResponse> results = reservationService.getAllReservations();

        assertEquals(1, results.size(), "Should return exactly 1 reservation");
    }
}
