package com.oceanview.service;

import com.oceanview.dto.RoomRequest;
import com.oceanview.dto.RoomResponse;
import com.oceanview.exception.DuplicateResourceException;
import com.oceanview.exception.ResourceNotFoundException;
import com.oceanview.factory.RoomFactory;
import com.oceanview.model.Room;
import com.oceanview.repository.RoomRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class RoomService {

    private final RoomRepository roomRepository;

    public List<RoomResponse> getAllRooms() {
        return roomRepository.findAll().stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
    }

    public List<RoomResponse> getAvailableRooms() {
        return roomRepository.findByIsAvailableTrue().stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
    }

    public RoomResponse createRoom(RoomRequest request) {
        if (roomRepository.existsByRoomNumber(request.getRoomNumber())) {
            throw new DuplicateResourceException("Room already exists: " + request.getRoomNumber());
        }

        Room room = RoomFactory.getInstance()
                .createRoom(request.getRoomType(), request.getRoomNumber(), request.getFloorNumber());

        return toResponse(roomRepository.save(room));
    }

    public RoomResponse toggleAvailability(String id, boolean available) {
        Room room = roomRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Room not found: " + id));
        room.setAvailable(available);
        return toResponse(roomRepository.save(room));
    }

    public void deleteRoom(String id) {
        if (!roomRepository.existsById(id)) {
            throw new ResourceNotFoundException("Room not found: " + id);
        }
        roomRepository.deleteById(id);
    }

    private RoomResponse toResponse(Room room) {
        return RoomResponse.builder()
                .id(room.getId())
                .roomNumber(room.getRoomNumber())
                .roomType(room.getRoomType())
                .roomTypeDisplay(room.getRoomType().getDisplayName())
                .floorNumber(room.getFloorNumber())
                .capacity(room.getCapacity())
                .nightlyRate(room.getNightlyRate())
                .amenities(room.getAmenities())
                .isAvailable(room.isAvailable())
                .build();
    }
}
