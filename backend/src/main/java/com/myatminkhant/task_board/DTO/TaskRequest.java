package com.myatminkhant.task_board.DTO;

import java.time.LocalDate;

import com.myatminkhant.task_board.Enum.Priority;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public class TaskRequest {

    @NotBlank (message = "Task title is required.")
    private String title;

    @NotBlank (message = "Description is required.")
    private String description;

    @NotNull (message = "Priority is required.")
    private Priority priority;

    @NotNull (message = "Due Date is required.")
    private LocalDate due_date;

    public TaskRequest() {
        
    }

    public TaskRequest(String title, String description, Priority priority,LocalDate due_date) {
        this.title = title;
        this.description = description;
        this.priority = priority;
        this.due_date = due_date;
    }

    public String getTitle() {
        return title;
    }

    public String getDescription() {
        return description;
    }

    public Priority getPriority() {
        return priority;
    }

    public LocalDate getDue_date() {
        return due_date;
    }
    
}
