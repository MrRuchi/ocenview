package com.oceanview.service;

import com.oceanview.dto.AuthResponse;
import com.oceanview.dto.LoginRequest;
import com.oceanview.dto.RegisterRequest;
import com.oceanview.exception.AccountLockedException;
import com.oceanview.exception.DuplicateResourceException;
import com.oceanview.model.User;
import com.oceanview.repository.UserRepository;
import com.oceanview.security.JwtUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;
    private final JwtUtil jwtUtil;
    private final BCryptPasswordEncoder passwordEncoder;

    public AuthResponse login(LoginRequest request) {
        User user = userRepository.findByUsername(request.getUsername())
                .orElseThrow(() -> new IllegalArgumentException("Invalid username or password"));

        if (!user.isActive()) {
            throw new AccountLockedException("Account is locked. Please contact an administrator.");
        }

        if (!passwordEncoder.matches(request.getPassword(), user.getPasswordHash())) {
            user.incrementFailedAttempts();
            userRepository.save(user);
            if (!user.isActive()) {
                throw new AccountLockedException("Account locked after 3 failed attempts.");
            }
            throw new IllegalArgumentException("Invalid username or password");
        }

        user.resetFailedAttempts();
        user.setLastLoginAt(LocalDateTime.now());
        userRepository.save(user);

        String token = jwtUtil.generateToken(user.getUsername(), user.getRole().name(), user.getId());
        return new AuthResponse(token, user.getUsername(), user.getRole().name(), user.getId());
    }

    public User register(RegisterRequest request) {
        if (userRepository.existsByUsername(request.getUsername())) {
            throw new DuplicateResourceException("Username already exists: " + request.getUsername());
        }

        User user = User.builder()
                .username(request.getUsername())
                .passwordHash(passwordEncoder.encode(request.getPassword()))
                .role(request.getRole())
                .isActive(true)
                .failedLoginAttempts(0)
                .build();

        return userRepository.save(user);
    }
}
