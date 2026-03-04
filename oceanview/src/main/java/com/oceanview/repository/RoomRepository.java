package com.oceanview.repository;

import com.oceanview.model.Room;
import com.oceanview.model.RoomType;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface RoomRepository extends MongoRepository<Room, String> {

    Optional<Room> findByRoomNumber(String roomNumber);

    List<Room> findByRoomType(RoomType roomType);

    List<Room> findByIsAvailableTrue();

    boolean existsByRoomNumber(String roomNumber);
}
