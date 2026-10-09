package com.myatminkhant.task_board.DTO;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;

public class LoginRequest {
    
    @NotBlank (message = "Email is required.") @Email (message = "Invalid email.")
    private String email;

    @NotBlank (message = "Password is required.")
    private String password_hash;

    public LoginRequest() {

    }

    public LoginRequest(String email, String password_hash) {
        this.email = email;
        this.password_hash = password_hash;
    }

    public String getEmail() {
        return email;
    }

    public String getPassword_hash() {
        return password_hash;
    }

    
}
