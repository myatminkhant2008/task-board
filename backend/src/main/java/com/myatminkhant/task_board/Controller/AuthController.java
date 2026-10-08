package com.myatminkhant.task_board.Controller;

import org.springframework.web.bind.annotation.RestController;

import com.myatminkhant.task_board.DTO.LoginRequest;
import com.myatminkhant.task_board.DTO.SignupRequest;
import com.myatminkhant.task_board.Entity.User;
import com.myatminkhant.task_board.Service.AuthService;

import java.util.Map;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.GetMapping;

@RestController 
@RequestMapping("/api")
public class AuthController {
    
    private final AuthService authService;

    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    @PostMapping("/auth/register")
    public ResponseEntity<?> signup (@RequestBody SignupRequest request) {
        User result = authService.signup(request);

        return ResponseEntity.status(HttpStatus.CREATED).body(result);
    }

    @PostMapping("/auth/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest request) {
       Map<String,Object> result = authService.login(request);

       return ResponseEntity.ok(result);
    }

    @GetMapping("/users/me")
    public ResponseEntity<?> getMe(@RequestHeader ("Authorization") String token) {
        
        String result = token.replace("Bearer ", "");

        return ResponseEntity.ok(authService.getMe(result));

    }
    
}
