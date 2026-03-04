package com.oceanview.model;

import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import lombok.Builder;
import org.springframework.data.annotation.Id;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.index.Indexed;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Document(collection = "users")
public class User {

    @Id
    private String id;

    @Indexed(unique = true)
    private String username;

    private String passwordHash;

    private UserRole role;

    private boolean isActive = true;

    private int failedLoginAttempts = 0;

    @CreatedDate
    private LocalDateTime createdAt;

    private LocalDateTime lastLoginAt;

    public void incrementFailedAttempts() {
        this.failedLoginAttempts++;
        if (this.failedLoginAttempts >= 3) {
            this.isActive = false;
        }
    }

    public void resetFailedAttempts() {
        this.failedLoginAttempts = 0;
        this.isActive = true;
    }
}
