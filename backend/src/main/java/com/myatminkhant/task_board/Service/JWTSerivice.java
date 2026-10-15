package com.myatminkhant.task_board.Service;

import java.nio.charset.StandardCharsets;
import java.util.Date;

import javax.crypto.SecretKey;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;

@Service 
public class JWTSerivice {
    
    @Value ("${jwt.secret}")
    private String secret;

    public SecretKey getKey() {
        return Keys.hmacShaKeyFor(secret.getBytes(StandardCharsets.UTF_8));
    }

    public String GenerateToken(Long userID) {
        return Jwts.builder()
                   .subject(String.valueOf(userID))
                   .issuedAt(new Date())
                   .expiration(new Date(System.currentTimeMillis() + 86400000))
                   .signWith(getKey())
                   .compact();
    } 

    public Long getUserID(String token) {
        String userID = Jwts.parser()
                            .verifyWith(getKey())
                            .build()
                            .parseSignedClaims(token)
                            .getPayload()
                            .getSubject();
        return Long.valueOf(userID);
    }
}
