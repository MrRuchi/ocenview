package com.oceanview.config;

import com.oceanview.factory.RoomFactory;
import com.oceanview.model.Room;
import com.oceanview.model.RoomType;
import com.oceanview.model.User;
import com.oceanview.model.UserRole;
import com.oceanview.repository.RoomRepository;
import com.oceanview.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class DataInitializer implements CommandLineRunner {

    private static final Logger logger = LoggerFactory.getLogger(DataInitializer.class);

    private final UserRepository userRepository;
    private final RoomRepository roomRepository;
    private final BCryptPasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) {
        seedUsers();
        seedRooms();
    }

    private void seedUsers() {
        if (!userRepository.existsByUsername("admin")) {
            User admin = User.builder()
                    .username("admin")
                    .passwordHash(passwordEncoder.encode("Admin@123"))
                    .role(UserRole.ADMIN)
                    .isActive(true)
                    .failedLoginAttempts(0)
                    .build();
            userRepository.save(admin);
            logger.info("Default admin user created  —  username: admin, password: Admin@123");
        }

        if (!userRepository.existsByUsername("staff")) {
            User staff = User.builder()
                    .username("staff")
                    .passwordHash(passwordEncoder.encode("Staff@123"))
                    .role(UserRole.STAFF)
                    .isActive(true)
                    .failedLoginAttempts(0)
                    .build();
            userRepository.save(staff);
            logger.info("Default staff user created  —  username: staff, password: Staff@123");
        }
    }

    private void seedRooms() {
        if (roomRepository.count() > 0) return;

        RoomFactory factory = RoomFactory.getInstance();

        String[][] rooms = {
            {"S101","STANDARD","1"}, {"S102","STANDARD","1"}, {"S103","STANDARD","1"},
            {"S104","STANDARD","1"}, {"S105","STANDARD","1"},
            {"D201","DELUXE","2"},   {"D202","DELUXE","2"},
            {"D203","DELUXE","2"},   {"D204","DELUXE","2"},
            {"SU301","SUITE","3"},   {"SU302","SUITE","3"},   {"SU303","SUITE","3"},
            {"BV001","BEACHFRONT_VILLA","1"}, {"BV002","BEACHFRONT_VILLA","1"}
        };

        for (String[] r : rooms) {
            Room room = factory.createRoom(RoomType.valueOf(r[1]), r[0], Integer.parseInt(r[2]));
            roomRepository.save(room);
        }

        logger.info("Sample rooms seeded: 5 Standard, 4 Deluxe, 3 Suite, 2 Beachfront Villa");
    }
}
