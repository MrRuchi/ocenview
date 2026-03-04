package com.oceanview.model;

import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import lombok.Builder;
import org.springframework.data.annotation.Id;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.index.Indexed;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Document(collection = "guests")
public class Guest {

    @Id
    private String id;

    @NotBlank(message = "First name is required")
    private String firstName;

    @NotBlank(message = "Last name is required")
    private String lastName;

    @Email(message = "Invalid email format")
    @Indexed(unique = true)
    private String email;

    @Pattern(regexp = "^[0-9+\\-\\s]{7,15}$", message = "Invalid contact number")
    private String contactNumber;

    private String address;

    @CreatedDate
    private LocalDateTime createdAt;

    public String getFullName() {
        return firstName + " " + lastName;
    }
}
