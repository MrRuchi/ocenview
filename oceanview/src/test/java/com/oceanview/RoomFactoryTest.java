package com.oceanview;

import com.oceanview.factory.RoomFactory;
import com.oceanview.model.Room;
import com.oceanview.model.RoomType;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.DisplayName;
import static org.junit.jupiter.api.Assertions.*;
import java.math.BigDecimal;

@DisplayName("RoomFactory — Singleton + Factory Pattern Tests")
class RoomFactoryTest {

        @Test
        @DisplayName("TC01 — getInstance() returns same instance (Singleton)")
        void testSingletonInstance() {
                RoomFactory instance1 = RoomFactory.getInstance();
                RoomFactory instance2 = RoomFactory.getInstance();
                assertSame(instance1, instance2,
                                "RoomFactory must return the same instance every time");
        }

        @Test
        @DisplayName("TC02 — createRoom STANDARD has correct rate LKR 8000")
        void testStandardRoomRate() {
                Room room = RoomFactory.getInstance()
                                .createRoom(RoomType.STANDARD, "S101", 1);
                assertEquals(new BigDecimal("8000"), room.getNightlyRate(),
                                "Standard room nightly rate must be LKR 8,000");
        }

        @Test
        @DisplayName("TC03 — createRoom DELUXE has correct rate LKR 12000")
        void testDeluxeRoomRate() {
                Room room = RoomFactory.getInstance()
                                .createRoom(RoomType.DELUXE, "D201", 2);
                assertEquals(new BigDecimal("12000"), room.getNightlyRate(),
                                "Deluxe room nightly rate must be LKR 12,000");
        }

        @Test
        @DisplayName("TC04 — createRoom SUITE has correct rate LKR 18000")
        void testSuiteRoomRate() {
                Room room = RoomFactory.getInstance()
                                .createRoom(RoomType.SUITE, "SU301", 3);
                assertEquals(new BigDecimal("18000"), room.getNightlyRate(),
                                "Suite nightly rate must be LKR 18,000");
        }

        @Test
        @DisplayName("TC05 — createRoom BEACHFRONT_VILLA has correct rate LKR 25000")
        void testVillaRoomRate() {
                Room room = RoomFactory.getInstance()
                                .createRoom(RoomType.BEACHFRONT_VILLA, "BV001", 1);
                assertEquals(new BigDecimal("25000"), room.getNightlyRate(),
                                "Beachfront Villa nightly rate must be LKR 25,000");
        }

        @Test
        @DisplayName("TC06 — Standard room capacity is 2")
        void testStandardCapacity() {
                Room room = RoomFactory.getInstance()
                                .createRoom(RoomType.STANDARD, "S102", 1);
                assertEquals(2, room.getCapacity(),
                                "Standard room capacity must be 2 guests");
        }

        @Test
        @DisplayName("TC07 — Suite capacity is 4")
        void testSuiteCapacity() {
                Room room = RoomFactory.getInstance()
                                .createRoom(RoomType.SUITE, "SU302", 3);
                assertEquals(4, room.getCapacity(),
                                "Suite capacity must be 4 guests");
        }

        @Test
        @DisplayName("TC08 — Beachfront Villa capacity is 6")
        void testVillaCapacity() {
                Room room = RoomFactory.getInstance()
                                .createRoom(RoomType.BEACHFRONT_VILLA, "BV002", 1);
                assertEquals(6, room.getCapacity(),
                                "Beachfront Villa capacity must be 6 guests");
        }

        @Test
        @DisplayName("TC09 — New room is available by default")
        void testRoomAvailableByDefault() {
                Room room = RoomFactory.getInstance()
                                .createRoom(RoomType.STANDARD, "S103", 1);
                assertTrue(room.isAvailable(),
                                "Newly created room must be available by default");
        }

        @Test
        @DisplayName("TC10 — Room number is set correctly")
        void testRoomNumberSet() {
                Room room = RoomFactory.getInstance()
                                .createRoom(RoomType.DELUXE, "D202", 2);
                assertEquals("D202", room.getRoomNumber(),
                                "Room number must match the value passed to factory");
        }

        @Test
        @DisplayName("TC11 — Floor number is set correctly")
        void testFloorNumberSet() {
                Room room = RoomFactory.getInstance()
                                .createRoom(RoomType.SUITE, "SU303", 3);
                assertEquals(3, room.getFloorNumber(),
                                "Floor number must match the value passed to factory");
        }

        @Test
        @DisplayName("TC12 — STANDARD room type is set correctly")
        void testRoomTypeSet() {
                Room room = RoomFactory.getInstance()
                                .createRoom(RoomType.STANDARD, "S104", 1);
                assertEquals(RoomType.STANDARD, room.getRoomType(),
                                "Room type must match the requested type");
        }

        @Test
        @DisplayName("TC13 — Amenities are not null or empty")
        void testAmenitiesNotEmpty() {
                Room room = RoomFactory.getInstance()
                                .createRoom(RoomType.DELUXE, "D203", 2);
                assertNotNull(room.getAmenities(), "Amenities must not be null");
                assertFalse(room.getAmenities().isBlank(), "Amenities must not be blank");
        }

        // @Test
        // @DisplayName("TC14 — Null room type throws IllegalArgumentException")
        // void testNullRoomTypeThrows() {
        // assertThrows(IllegalArgumentException.class, () ->
        // RoomFactory.getInstance().createRoom(null, "X999", 1),
        // "Null room type must throw IllegalArgumentException"
        // );
        // }

        @Test
        @DisplayName("TC14 — Null room type throws IllegalArgumentException")
        void testNullRoomTypeThrows() {
                assertThrows(IllegalArgumentException.class,
                                () -> RoomFactory.getInstance().createRoom(null, "X999", 1),
                                "Null room type must throw IllegalArgumentException");
        }
}
