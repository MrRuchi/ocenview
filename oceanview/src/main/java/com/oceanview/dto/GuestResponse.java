package com.oceanview.dto;

import lombok.Data;
import lombok.Builder;

@Data
@Builder
public class GuestResponse {
    private String id;
    private String firstName;
    private String lastName;
    private String fullName;
    private String email;
    private String contactNumber;
    private String address;
}
