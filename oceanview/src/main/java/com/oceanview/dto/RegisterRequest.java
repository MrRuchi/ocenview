package com.oceanview.dto;

import com.oceanview.model.UserRole;
import lombok.Data;

@Data
public class RegisterRequest {
    private String username;
    private String password;
    private UserRole role;
}
