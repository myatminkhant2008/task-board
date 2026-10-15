package com.myatminkhant.task_board.DTO;


import java.time.LocalDate;

import com.myatminkhant.task_board.Enum.Priority;
import com.myatminkhant.task_board.Enum.Status;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public class TaskUpdateRequest {

    @NotBlank (message = "Title is required.")
    private String title;

    @NotBlank (message = "Description is required.")
    private String description;

    @NotNull (message = "Status is required.")
    private  Status status;

    @NotNull (message = "Priority is required.")
    private Priority priority;

    @NotNull (message = "Due Date is required.")
    private LocalDate due_date;

    public TaskUpdateRequest () {
        
    }

    public TaskUpdateRequest( String title, String description, Status status, Priority priority, LocalDate due_date) {
        this.title = title;
        this.description = description;
        this.status = status;
        this.priority = priority;
        this.due_date = due_date;
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

    
}
