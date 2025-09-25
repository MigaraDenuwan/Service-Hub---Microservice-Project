package com.example.userservice.dto;

import lombok.*;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Setter
@Getter
public class RegisterRequest {
    private String fullName;
    private String email;
    private String password;
    private String role;

    // Getters and Setters
}
