package com.oceanview.repository;

import com.oceanview.model.Guest;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface GuestRepository extends MongoRepository<Guest, String> {

    Optional<Guest> findByEmail(String email);

    Optional<Guest> findByContactNumber(String contactNumber);

    List<Guest> findByFirstNameContainingIgnoreCaseOrLastNameContainingIgnoreCase(
            String firstName, String lastName);
}
