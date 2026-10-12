package com.myatminkhant.task_board.Controller;

import org.springframework.web.bind.annotation.RestController;

import com.myatminkhant.task_board.DTO.ProjectRequest;
import com.myatminkhant.task_board.DTO.ProjectResponse;
import com.myatminkhant.task_board.Entity.Project;
import com.myatminkhant.task_board.Repository.ProjectRepository;
import com.myatminkhant.task_board.Service.ProjectService;

import jakarta.validation.Valid;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.GetMapping;

@RestController 
@RequestMapping ("/api")
public class ProjectController {

    private final ProjectService projectService;

    public ProjectController(ProjectService projectService) {
        this.projectService = projectService;
    }

    @PostMapping("/projects")
    public ResponseEntity<?> createProject(@Valid @RequestBody ProjectRequest request,@RequestHeader("Authorization") String tokne) {
        
        String final_token = tokne.replace("Bearer ", "");

        String result = projectService.createProject(request, final_token);

        return ResponseEntity.status(HttpStatus.CREATED).body(result);
    }

    @GetMapping("/projects")
    public ResponseEntity<?> getProject(@RequestHeader("Authorization") String tokne) {
        
        String final_token = tokne.replace("Bearer ", "");
        List<ProjectResponse> result = projectService.getMyProjects(final_token);

        return ResponseEntity.ok(result);
    }
    
    
}
