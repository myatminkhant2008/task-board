package com.myatminkhant.task_board.Controller;

import org.springframework.web.bind.annotation.RestController;

import com.myatminkhant.task_board.DTO.StatusUpdateRequest;
import com.myatminkhant.task_board.DTO.TaskRequest;
import com.myatminkhant.task_board.DTO.TaskResponse;
import com.myatminkhant.task_board.DTO.TaskUpdateRequest;
import com.myatminkhant.task_board.Enum.Status;
import com.myatminkhant.task_board.Service.TaskService;

import jakarta.validation.Valid;

import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PutMapping;


@RestController 
@RequestMapping ("/api")
public class TaskController {

    private final TaskService taskService;

    public TaskController(TaskService taskService) {
        this.taskService = taskService;
    }

    @PostMapping("/projects/{id}/tasks")
    public ResponseEntity<?> addTask(@PathVariable Long id,@Valid @RequestBody TaskRequest request,@RequestHeader ("Authorization") String token) {
        
        String final_token = token.replace("Bearer ", "");
        TaskResponse result = taskService.addTask(id, request, final_token);
        return ResponseEntity.status(HttpStatus.CREATED).body(result);
    }

    @GetMapping("/projects/{id}/tasks")
    public ResponseEntity<?> getTask(@PathVariable Long id,@RequestHeader ("Authorization") String token,
                                     @RequestParam (required = false) Status status,
                                     @RequestParam (required = false) String search,
                                     @RequestParam (defaultValue = "0") int page,
                                     @RequestParam (defaultValue = "20") int size ,
                                     @RequestParam (defaultValue = "dueDate") String sort
                                    ) {
        
        String final_token = token.replace("Bearer ", "");
        Page<TaskResponse> result = taskService.getTask(id, search,status,page,size,sort,final_token);

        return ResponseEntity.ok(result);
    }

    @GetMapping("/tasks/{id}")
    public ResponseEntity<?> getTaskOne(@PathVariable Long id,@RequestHeader ("Authorization") String token) {
       
        String final_token = token.replace("Bearer ", "");
        TaskResponse task = taskService.getTaskOne(id,final_token);
        return ResponseEntity.ok(task);

    }

    @PutMapping("/tasks/{id}")
    public ResponseEntity<?> updateTask(@PathVariable Long id,@Valid @RequestBody TaskUpdateRequest request, @RequestHeader ("Authorization") String token) {
        String final_token = token.replace("Bearer ", "");

        TaskResponse task = taskService.updateTask(id,request,final_token);

        return ResponseEntity.ok(task);
    }

    @PatchMapping("/tasks/{id}/status")
    public ResponseEntity<?> updateStatus(@PathVariable Long id,@Valid @RequestBody StatusUpdateRequest request,@RequestHeader ("Authorization") String token) {

        String final_token = token.replace("Bearer ", "");

        TaskResponse task = taskService.updateStatus(id,request,final_token);

        return ResponseEntity.ok(task);
    }
    
    @DeleteMapping ("/tasks/{id}")
    public ResponseEntity<?> deleteTask(@PathVariable Long id,@RequestHeader ("Authorization") String token) {

        String final_token = token.replace("Bearer ", "");
        taskService.deleteTask(id,final_token);

        return ResponseEntity.noContent().build();
    }
}
