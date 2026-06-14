package com.library.digital.controllers;

import com.library.digital.dto.AuthRequest;
import com.library.digital.dto.SignupRequest;
import com.library.digital.models.User;
import com.library.digital.repositories.UserRepository;
import com.library.digital.security.JwtUtils;
import com.library.digital.security.UserDetailsImpl;

import jakarta.validation.Valid;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/auth")
public class AuthController {

    @Autowired
    AuthenticationManager authenticationManager;

    @Autowired
    UserRepository userRepository;

    @Autowired
    PasswordEncoder encoder;

    @Autowired
    JwtUtils jwtUtils;

    // =========================
    // LOGIN API
    // =========================
    @PostMapping("/signin")
    public ResponseEntity<?> authenticateUser(
            @Valid @RequestBody AuthRequest loginRequest) {

        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        loginRequest.getUsername(),
                        loginRequest.getPassword()));

        SecurityContextHolder.getContext().setAuthentication(authentication);

        String jwt = jwtUtils.generateJwtToken(authentication);

        UserDetailsImpl userDetails =
                (UserDetailsImpl) authentication.getPrincipal();

        // RESPONSE MAP
        Map<String, Object> response = new HashMap<>();

        response.put("token", jwt);
        response.put("id", userDetails.getId());
        response.put("username", userDetails.getUsername());
        response.put("email", userDetails.getEmail());
        response.put("role", userDetails.getRole());

        return ResponseEntity.ok(response);
    }

    // =========================
    // REGISTER API
    // =========================
    @PostMapping("/signup")
    public ResponseEntity<?> registerUser(
            @Valid @RequestBody SignupRequest signUpRequest) {

        // Check username
        if (userRepository.existsByUsername(signUpRequest.getUsername())) {

            Map<String, String> error = new HashMap<>();

            error.put("message",
                    "Error: Username is already taken!");

            return ResponseEntity.badRequest().body(error);
        }

        // Check email
        if (userRepository.existsByEmail(signUpRequest.getEmail())) {

            Map<String, String> error = new HashMap<>();

            error.put("message",
                    "Error: Email is already in use!");

            return ResponseEntity.badRequest().body(error);
        }

        // Create user
        User user = new User();

        user.setUsername(signUpRequest.getUsername());

        user.setEmail(signUpRequest.getEmail());

        user.setPassword(
                encoder.encode(signUpRequest.getPassword()));

        // Set role
        String role = signUpRequest.getRole();

        if (role == null || role.equalsIgnoreCase("user")) {

            user.setRole("USER");

        } else if (role.equalsIgnoreCase("admin")) {

            user.setRole("ADMIN");

        } else {

            user.setRole("USER");
        }

        // Save user
        userRepository.save(user);

        Map<String, String> response = new HashMap<>();

        response.put("message",
                "User registered successfully!");

        return ResponseEntity.ok(response);
    }
}