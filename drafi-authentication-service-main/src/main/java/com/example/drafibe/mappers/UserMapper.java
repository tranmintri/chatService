package com.example.drafibe.mappers;

import com.example.drafibe.dtos.UserResponse;
import com.example.drafibe.models.User;

public class UserMapper {

    public static UserResponse toUserResponse(User user) {
        return UserResponse.builder()
                .id(user.getId())
                .displayName(user.getDisplayName())
                .username(user.getUsername())
                .email(user.getEmail())
                .emailVerified(user.getEmailVerified())
                .phone(user.getPhone())
                .phoneVerified(user.getPhoneVerified())
                .status(user.getStatus().name())
                .avatar(user.getAvatar())
                .authType(user.getAuthType().name())
                .createdAt(user.getCreatedAt().toEpochSecond())
                .updatedAt(user.getUpdatedAt().toEpochSecond())
                .build();
    }

}