package com.example.drafibe.controllers;

import com.example.drafibe.dtos.UpdateAvatarRequest;
import com.example.drafibe.dtos.UpdateUserRequest;
import com.example.drafibe.dtos.UserResponse;
import com.example.drafibe.services.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/users")
@RequiredArgsConstructor
public class UserController {

    private final UserService userService;

    @GetMapping("/{id}")
    public ResponseEntity<?> getUserInfo(@PathVariable("id") String id) {
        System.out.println(id);
        UserResponse info = userService.getUserInfo(id);
        System.out.println(info);
        return ResponseEntity.ok(info);
    }

    @PutMapping
    public ResponseEntity<?> updateUserInfo(@RequestBody UpdateUserRequest request) {
        return ResponseEntity.ok(userService.updateUserInfo(request));
    }

    @PutMapping("/avatar")
    public ResponseEntity<?> updateAvatar(@ModelAttribute UpdateAvatarRequest request) {
        return ResponseEntity.ok(userService.updateAvatarInfo(request));
    }

}