package com.myatminkhant.task_board.DTO;

import java.time.LocalDateTime;

public class UserResponse {
    
    private Long id;

    private String name;

    private String email;

    private LocalDateTime created_at;

    public UserResponse(Long id, String name, String email, LocalDateTime created_at) {
        this.id = id;
        this.name = name;
        this.email = email;
        this.created_at = created_at;
    }

    public Long getId() {
        return id;
    }

    public String getName() {
        return name;
    }

    public String getEmail() {
        return email;
    }

    public LocalDateTime getCreated_at() {
        return created_at;
    }

}
