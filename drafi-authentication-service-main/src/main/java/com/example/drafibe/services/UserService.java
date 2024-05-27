package com.example.drafibe.services;

import com.example.drafibe.dtos.UpdateAvatarRequest;
import com.example.drafibe.dtos.UpdateUserRequest;
import com.example.drafibe.dtos.UserResponse;
import jakarta.validation.Valid;
import org.springframework.stereotype.Service;
import org.springframework.validation.annotation.Validated;

@Service
@Validated
public interface UserService {

    UserResponse getUserInfo(String uid);
    UserResponse updateUserInfo(UpdateUserRequest request);
    UserResponse updateAvatarInfo(@Valid UpdateAvatarRequest request);

}