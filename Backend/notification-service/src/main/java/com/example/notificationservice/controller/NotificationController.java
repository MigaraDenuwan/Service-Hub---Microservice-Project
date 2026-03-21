package com.example.notificationservice.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@CrossOrigin(origins = {"http://localhost:5173", "http://localhost"})
@RestController
@RequestMapping("/api/notifications")
public class NotificationController {

    @Autowired
    private JavaMailSender mailSender;

    @PostMapping("/send")
    public ResponseEntity<String> sendNotification(@RequestBody NotificationRequest request) {
        try {
            SimpleMailMessage message = new SimpleMailMessage();
            message.setFrom("it22143204@my.sliit.lk");
            message.setTo(request.getEmail());
            message.setSubject("Service Hub Notification");
            message.setText(request.getMessage());
            
            mailSender.send(message);
            
            System.out.println("Actual Email Sent to: " + request.getEmail());
            return ResponseEntity.ok("Email sent successfully!");
        } catch (Exception e) {
            System.err.println("Error sending email: " + e.getMessage());
            return ResponseEntity.status(500).body("Error sending email: " + e.getMessage());
        }
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
