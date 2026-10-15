package com.myatminkhant.task_board.DTO;

import java.time.LocalDateTime;

public class ProjectResponse {

    private Long id;
    private String name;
    private String description;
    private Long owner_id;
    private LocalDateTime created_at;
    
    public ProjectResponse(Long id, String name, String description, Long owner_id, LocalDateTime created_at) {
        this.id = id;
        this.name = name;
        this.description = description;
        this.owner_id = owner_id;
        this.created_at = created_at;
    }

    public Long getId() {
        return id;
    }

    public String getName() {
        return name;
    }

    public String getDescription() {
        return description;
    }

    public Long getOwner_id() {
        return owner_id;
    }

    public LocalDateTime getCreated_at() {
        return created_at;
    }

    
}
