package com.myatminkhant.task_board.DTO;

import jakarta.validation.constraints.NotBlank;

public class ProjectRequest {

    @NotBlank (message = "Project name is required.")
    private String name;

    @NotBlank (message = "Description is required.")
    private String description;

    public ProjectRequest() {

    }

    public ProjectRequest(@NotBlank(message = "Project name is required.") String name,
            @NotBlank(message = "Description is required.") String description) {
        this.name = name;
        this.description = description;
    }

    public String getName() {
        return name;
    }

    public String getDescription() {
        return description;
    }

}
