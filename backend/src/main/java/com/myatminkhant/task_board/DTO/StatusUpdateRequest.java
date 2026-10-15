package com.myatminkhant.task_board.DTO;

import com.myatminkhant.task_board.Enum.Status;

import jakarta.validation.constraints.NotNull;

public class StatusUpdateRequest {

    @NotNull (message = "Status is required.")
    private Status status;

    public StatusUpdateRequest() {

    }

    public StatusUpdateRequest(Status status) {
        this.status = status;
    }

    public Status getStatus() {
        return status;
    }

    
}
