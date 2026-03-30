package com.example.userservice.service;

import com.example.userservice.dto.*;
import com.example.userservice.model.User;
import com.example.userservice.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import java.util.HashMap;
import java.util.Map;

import java.util.Optional;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

@Service
public class UserService {

    private static final Logger logger = LoggerFactory.getLogger(UserService.class);

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private RestTemplate restTemplate;

    public User register(RegisterRequest request) {
        User user = new User();
        user.setFullName(request.getFullName());
        user.setEmail(request.getEmail());
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        user.setRole(request.getRole());
        User savedUser = userRepository.save(user);

        // Notify user via notification-service
        try {
            Map<String, String> notificationRequest = new HashMap<>();
            notificationRequest.put("email", savedUser.getEmail());
            notificationRequest.put("message", "Welcome to Service Hub, " + savedUser.getFullName() + "! Your account has been successfully created.");
            
            restTemplate.postForObject("http://notification-service/api/notifications/send", notificationRequest, String.class);
            logger.info("Registration Notification triggered for: {}", savedUser.getEmail());
        } catch (Exception e) {
            logger.error("Failed to send registration notification: {}", e.getMessage());
        }

        return savedUser;
    }

    public Optional<User> authenticate(LoginRequest request) {
        Optional<User> userOpt = userRepository.findByEmail(request.getEmail());
        if (userOpt.isPresent()) {
            User user = userOpt.get();
            if (passwordEncoder.matches(request.getPassword(), user.getPassword())) {
                return Optional.of(user);
            }
        }
        return Optional.empty();
    }
}
