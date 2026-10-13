package com.myatminkhant.task_board.DTO;

import java.time.LocalDate;
import java.time.LocalDateTime;

import com.myatminkhant.task_board.Enum.Priority;
import com.myatminkhant.task_board.Enum.Status;

public class TaskResponse {

    private Long id;
    private String title;
    private String description;
    private Status status;
    private Priority priority;
    private LocalDate due_date;
    private Long project_id;
    private Long assignee_id;
    private LocalDateTime created_at;
    
    public TaskResponse(Long id, String name, String description, Status status, Priority priority, LocalDate due_date,
            Long project_id, Long assignee_id, LocalDateTime created_at) {
        this.id = id;
        this.title = name;
        this.description = description;
        this.status = status;
        this.priority = priority;
        this.due_date = due_date;
        this.project_id = project_id;
        this.assignee_id = assignee_id;
        this.created_at = created_at;
    }

    public Long getId() {
        return id;
    }

    public String getTitle() {
        return title;
    }

    public String getDescription() {
        return description;
    }

    public Status getStatus() {
        return status;
    }

    public Priority getPriority() {
        return priority;
    }

    public LocalDate getDue_date() {
        return due_date;
    }

    public Long getProject_id() {
        return project_id;
    }

    public Long getAssignee_id() {
        return assignee_id;
    }

    public LocalDateTime getCreated_at() {
        return created_at;
    }

    
}
