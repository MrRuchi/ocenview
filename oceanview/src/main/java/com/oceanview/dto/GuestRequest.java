package com.oceanview.dto;

import lombok.Data;

@Data
public class GuestRequest {
    private String firstName;
    private String lastName;
    private String email;
    private String contactNumber;
    private String address;
}
