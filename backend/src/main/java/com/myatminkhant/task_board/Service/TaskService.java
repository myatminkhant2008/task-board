package com.myatminkhant.task_board.Service;

import java.util.ArrayList;
import java.util.List;

import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import com.myatminkhant.task_board.DTO.StatusUpdateRequest;
import com.myatminkhant.task_board.DTO.TaskRequest;
import com.myatminkhant.task_board.DTO.TaskResponse;
import com.myatminkhant.task_board.DTO.TaskUpdateRequest;
import com.myatminkhant.task_board.Entity.Project;
import com.myatminkhant.task_board.Entity.Task;
import com.myatminkhant.task_board.Entity.User;
import com.myatminkhant.task_board.Enum.Status;
import com.myatminkhant.task_board.Repository.ProjectRepository;
import com.myatminkhant.task_board.Repository.TaskRepository;
import com.myatminkhant.task_board.Repository.UserRepository;

@Service 
public class TaskService {

    private final TaskRepository repository;
    private final UserRepository userRepository;
    private final ProjectRepository projectRepository;
    private final JWTSerivice jwt;

    public TaskService(TaskRepository repository,JWTSerivice jwt,UserRepository userRepository,ProjectRepository projectRepository) {
        this.repository = repository;
        this.jwt = jwt;
        this.userRepository = userRepository;
        this.projectRepository = projectRepository;
    }

    public TaskResponse addTask(Long project_id,TaskRequest request,String token) {


        Long userID = jwt.getUserID(token);
        User user = userRepository.findById(userID).orElseThrow(
            () -> new ResponseStatusException(HttpStatus.UNAUTHORIZED,"User not found."));
        
        Project project = projectRepository.findById(project_id).orElseThrow(
            () -> new ResponseStatusException(HttpStatus.NOT_FOUND,"Project not found."));

        Task task = new Task();

        task.setTitle(request.getTitle());
        task.setDescription(request.getDescription());
        task.setStatus(request.getStatus());
        task.setPriority(request.getPriority());
        task.setDue_date(request.getDue_date());
        task.setProject(project);
        task.setUser(user);

        repository.save(task);

        TaskResponse response = new TaskResponse(
            task.getId(), 
            task.getTitle(), 
            task.getDescription(), 
            task.getStatus(), 
            task.getPriority(), 
            task.getDue_date(), 
            task.getProject().getId(), 
            task.getUser().getId(), 
            task.getCreated_at());

        return response;
    }

    public List<TaskResponse> getTask(Long project_id,String search,Status status,int page,int size,String sort,String token) {
        Long assignee_id = jwt.getUserID(token);

        projectRepository.findById(project_id).orElseThrow(
            () -> new ResponseStatusException(HttpStatus.NOT_FOUND,"Project not found.")
        );

        if(search != null && search.isBlank()) {
            search = null;
        }

        String sortField;
        if("dueDate".equals(sort)) {
            sortField = "due_date";
        }
        else {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST,"Invalid sort field.");
        }

        Pageable pageable = PageRequest.of(page, size, Sort.by(Sort.Direction.DESC,sortField));

        Page<Task> tasks = repository.searchTask(project_id, search, status, pageable);

        List<TaskResponse> taskResponses = new ArrayList<>();

        for(Task task:tasks) {
           TaskResponse response = new TaskResponse(
            task.getId(), 
            task.getTitle(), 
            task.getDescription(), 
            task.getStatus(), 
            task.getPriority(), 
            task.getDue_date(), 
            task.getProject().getId(), 
            task.getUser().getId(), 
            task.getCreated_at());

            taskResponses.add(response);
        }

        return taskResponses;

    }

    public TaskResponse getTaskOne(Long id) {

       Task task = repository.findById(id).orElseThrow(
        ()-> new ResponseStatusException(HttpStatus.NOT_FOUND,"Task not found.")
       );
       
        TaskResponse response = new TaskResponse(
            task.getId(), 
            task.getTitle(), 
            task.getDescription(), 
            task.getStatus(), 
            task.getPriority(), 
            task.getDue_date(), 
            task.getProject().getId(), 
            task.getUser().getId(), 
            task.getCreated_at());

        return response;
    }
 
    public TaskResponse updateTask(Long id,TaskUpdateRequest request) {
        Task task = repository.findById(id).orElseThrow(
            () -> new ResponseStatusException(HttpStatus.NOT_FOUND,"Task not found.")
        );

        task.setTitle(request.getTitle());
        task.setDescription(request.getDescription());
        task.setStatus(request.getStatus());
        task.setPriority(request.getPriority());
        task.setDue_date(request.getDue_date());

        repository.save(task);

        TaskResponse response = new TaskResponse(
            task.getId(), 
            task.getTitle(), 
            task.getDescription(), 
            task.getStatus(), 
            task.getPriority(), 
            task.getDue_date(), 
            task.getProject().getId(), 
            task.getUser().getId(), 
            task.getCreated_at());

        return response;
    }
 
    public TaskResponse updateStatus(Long id,StatusUpdateRequest request) {
        Task task = repository.findById(id).orElseThrow(
            () -> new ResponseStatusException(HttpStatus.NOT_FOUND,"Task not found.")
        );

        Status currentStatus = task.getStatus();
        Status newStatus = request.getStatus();

        boolean isValidTransition = 
                  (currentStatus == Status.TODO && newStatus == Status.IN_PROGRESS) ||
                  (currentStatus == Status.IN_PROGRESS && newStatus == Status.TODO) ||
                  (currentStatus == Status.IN_PROGRESS && newStatus == Status.DONE) ||
                  (currentStatus == Status.DONE && newStatus == Status.IN_PROGRESS);

        if(!isValidTransition) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST,"Invalid task status transition.");
        }

        task.setStatus(newStatus);

        repository.save(task);

        TaskResponse response = new TaskResponse(
            task.getId(), 
            task.getTitle(), 
            task.getDescription(), 
            task.getStatus(), 
            task.getPriority(), 
            task.getDue_date(), 
            task.getProject().getId(), 
            task.getUser().getId(), 
            task.getCreated_at());

        return response;
    }

    public void deleteTask(Long id,String token) {
     
        Task task = repository.findById(id).orElseThrow(
            () -> new ResponseStatusException(HttpStatus.NOT_FOUND,"Task not found.")
        );

        Long userID = jwt.getUserID(token);

        if(task.getUser().getId() != userID) {

        throw new ResponseStatusException(HttpStatus.FORBIDDEN,"You cannot access this task.");
       }

        repository.delete(task);;
        
    }
}
