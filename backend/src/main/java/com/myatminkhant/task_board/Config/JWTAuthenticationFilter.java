package com.myatminkhant.task_board.Config;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.filter.OncePerRequestFilter;

import com.myatminkhant.task_board.Service.JWTSerivice;

import io.jsonwebtoken.JwtException;

import java.io.IOException;
import java.util.Collections;

public class JWTAuthenticationFilter extends OncePerRequestFilter {

    private final JWTSerivice jwt;

    public JWTAuthenticationFilter(JWTSerivice jwt) {
        this.jwt = jwt;
    }

    @Override
    protected void doFilterInternal(
                HttpServletRequest request,
                HttpServletResponse response,
                FilterChain filterChain) 
                throws ServletException, IOException {

                    String authHeader = request.getHeader("Authorization");

                    if(authHeader == null || !authHeader.startsWith("Bearer ")) {

                        filterChain.doFilter(request, response);
                        return ;

                    }


                    String token = authHeader.replace("Bearer ", "");

                    try {
                        Long userID = jwt.getUserID(token);

                        UsernamePasswordAuthenticationToken authentication = new UsernamePasswordAuthenticationToken(
                                                                                        userID,
                                                                                        null,
                                                                                        Collections.emptyList()
                                                                                    );

                        SecurityContextHolder.getContext().setAuthentication(authentication);
                        filterChain.doFilter(request, response);
                    } catch (JwtException | IllegalArgumentException e) {

                        response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
                        response.setContentType("application/json");

                        response.getWriter().write("{\"message\":\"Invalid or expired token.\"}");
                      }
                                           
                }

}
