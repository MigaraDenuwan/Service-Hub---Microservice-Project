package com.example.notificationservice.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/notifications")
public class NotificationController {

    @PostMapping("/send")
    public ResponseEntity<String> sendNotification(@RequestBody NotificationRequest request) {
        // Mocking the email sending process
        System.out.println("Sending notification to: " + request.getEmail());
        System.out.println("Message: " + request.getMessage());
        return ResponseEntity.ok("Notification sent successfully");
    }
}

class NotificationRequest {
    private String email;
    private String message;

    // Getters and Setters
    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }
    public String getMessage() { return message; }
    public void setMessage(String message) { this.message = message; }
}
