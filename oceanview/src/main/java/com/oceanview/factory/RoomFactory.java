package com.oceanview.factory;

import com.oceanview.model.Room;
import com.oceanview.model.RoomType;

public class RoomFactory {

    private static volatile RoomFactory instance;

    private RoomFactory() {
    }

    public static RoomFactory getInstance() {
        if (instance == null) {
            synchronized (RoomFactory.class) {
                if (instance == null) {
                    instance = new RoomFactory();
                }
            }
        }
        return instance;
    }

    public Room createRoom(RoomType roomType, String roomNumber, int floorNumber) {
        if (roomType == null) {
            throw new IllegalArgumentException("Room type cannot be null");
        }
        switch (roomType) {
            case STANDARD:
                return buildStandard(roomNumber, floorNumber);
            case DELUXE:
                return buildDeluxe(roomNumber, floorNumber);
            case SUITE:
                return buildSuite(roomNumber, floorNumber);
            case BEACHFRONT_VILLA:
                return buildVilla(roomNumber, floorNumber);
            default:
                throw new IllegalArgumentException("Unknown room type: " + roomType);
        }
    }

    private Room buildStandard(String roomNumber, int floor) {
        return Room.builder()
                .roomNumber(roomNumber)
                .roomType(RoomType.STANDARD)
                .floorNumber(floor)
                .capacity(2)
                .nightlyRate(RoomType.STANDARD.getNightlyRate())
                .amenities("Air conditioning, TV, WiFi, Hot water, Mini fridge")
                .isAvailable(true)
                .build();
    }

    private Room buildDeluxe(String roomNumber, int floor) {
        return Room.builder()
                .roomNumber(roomNumber)
                .roomType(RoomType.DELUXE)
                .floorNumber(floor)
                .capacity(2)
                .nightlyRate(RoomType.DELUXE.getNightlyRate())
                .amenities("Air conditioning, Smart TV, WiFi, Hot water, Mini bar, Ocean view balcony")
                .isAvailable(true)
                .build();
    }

    private Room buildSuite(String roomNumber, int floor) {
        return Room.builder()
                .roomNumber(roomNumber)
                .roomType(RoomType.SUITE)
                .floorNumber(floor)
                .capacity(4)
                .nightlyRate(RoomType.SUITE.getNightlyRate())
                .amenities(
                        "Air conditioning, Smart TV, WiFi, Jacuzzi, Mini bar, Living room, Ocean view balcony, Butler service")
                .isAvailable(true)
                .build();
    }

    private Room buildVilla(String roomNumber, int floor) {
        return Room.builder()
                .roomNumber(roomNumber)
                .roomType(RoomType.BEACHFRONT_VILLA)
                .floorNumber(floor)
                .capacity(6)
                .nightlyRate(RoomType.BEACHFRONT_VILLA.getNightlyRate())
                .amenities(
                        "Air conditioning, Smart TV, WiFi, Private pool, Full kitchen, BBQ area, Direct beach access, Butler service, Golf cart")
                .isAvailable(true)
                .build();
    }
}
