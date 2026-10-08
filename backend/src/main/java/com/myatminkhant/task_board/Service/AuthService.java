package com.myatminkhant.task_board.Service;

import java.util.Map;

import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import com.myatminkhant.task_board.DTO.LoginRequest;
import com.myatminkhant.task_board.DTO.SignupRequest;
import com.myatminkhant.task_board.Entity.User;
import com.myatminkhant.task_board.Repository.UserRepository;

@Service 
public class AuthService {

    private final UserRepository repository;
    private final JWTSerivice jwt;
    private final BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();

    public AuthService(UserRepository repository, JWTSerivice jwt) {
        this.repository = repository;
        this.jwt = jwt;
    }

    public User signup(SignupRequest request) {
       
        if(repository.existsByEmail(request.getEmail())) {
            throw new RuntimeException("Email already exists.");
        }

        User user = new User();

        user.setName(request.getName());
        user.setEmail(request.getEmail());
        user.setPassword_hash(passwordEncoder.encode(request.getPassword_hash()));

        repository.save(user);

        return user;
    } 

    public Map<String,Object> login(LoginRequest request) {

        User user = repository.findByEmail(request.getEmail()).orElseThrow(() -> new RuntimeException("Account not found."));

        boolean passwordMatches = passwordEncoder.matches(request.getPassword_hash(), user.getPassword_hash());

        if(!passwordMatches) {
            throw new RuntimeException("Incorrect password.");
        }

        String token = jwt.GenerateToken(user.getId());

        return Map.of(
            "token",token,
            "user",user
        );
    }

    public User getMe(String token) {
        Long userID = jwt.getUserID(token);

       User user = repository.findById(userID).orElseThrow(() -> new RuntimeException("User not found."));

       return user;
    }
}
