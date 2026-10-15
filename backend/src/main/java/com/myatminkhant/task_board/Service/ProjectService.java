package com.myatminkhant.task_board.Service;

import java.util.ArrayList;
import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import com.myatminkhant.task_board.DTO.ProjectRequest;
import com.myatminkhant.task_board.DTO.ProjectResponse;
import com.myatminkhant.task_board.Entity.Project;
import com.myatminkhant.task_board.Entity.User;
import com.myatminkhant.task_board.Repository.ProjectRepository;
import com.myatminkhant.task_board.Repository.UserRepository;

@Service 
public class ProjectService {
    
    private final ProjectRepository projectRepository;
    private final UserRepository userRepository;
    private final JWTSerivice jwt;
    
    public ProjectService(ProjectRepository projectRepository, UserRepository userRepository, JWTSerivice jwt) {
        this.projectRepository = projectRepository;
        this.userRepository = userRepository;
        this.jwt = jwt;
    }

    public ProjectResponse createProject(ProjectRequest request,String token) {

        Long userID = jwt.getUserID(token);
        User user = userRepository.findById(userID).orElseThrow(() -> new ResponseStatusException(HttpStatus.UNAUTHORIZED,"User not found."));

        Project project = new Project();
        project.setName(request.getName());
        project.setDescription(request.getDescription());
        project.setOwner(user);

        projectRepository.save(project);

         ProjectResponse response = new ProjectResponse(
                project.getId(),
                project.getName(),
                project.getDescription(),
                project.getOwner().getId(),
                project.getCreated_at()
            );

        return response;
    }
    
    public List<ProjectResponse> getMyProjects(String token) {
        Long userID = jwt.getUserID(token);

         List<Project> projects = projectRepository.findByOwnerId(userID);

         List<ProjectResponse> responses = new ArrayList<>();

         for (Project project : projects) {
             ProjectResponse response = new ProjectResponse(
                project.getId(),
                project.getName(),
                project.getDescription(),
                project.getOwner().getId(),
                project.getCreated_at()
            );

            responses.add(response);
        }

        return responses;
     }
}
