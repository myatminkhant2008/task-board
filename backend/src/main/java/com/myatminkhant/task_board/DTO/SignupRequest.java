package com.myatminkhant.task_board.DTO;

import java.time.LocalDateTime;

import jakarta.persistence.PrePersist;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public class SignupRequest {

    @NotBlank (message = "Name is required.")
    private String name;

    @NotBlank (message = "Email is required.") @Email (message = "Invalid email.")
    private String email;

    @NotBlank (message = "Password is required.") @Size (min = 6,message = "At least 6 character.")
    private String password_hash;

     private LocalDateTime created_at;

    @PrePersist
    protected void onCreate() {
        created_at = LocalDateTime.now();
    }

    public SignupRequest() {

    }

    public SignupRequest(String name, String email, String password_hash) {
        this.name = name;
        this.email = email;
        this.password_hash = password_hash;
    }

    public String getName() {
        return name;
    }

    public String getEmail() {
        return email;
    }

    public String getPassword_hash() {
        return password_hash;
    }

    public LocalDateTime getCreated_at() {
        return created_at;
    }

    
}
