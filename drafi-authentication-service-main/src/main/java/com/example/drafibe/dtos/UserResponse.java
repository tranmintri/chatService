package com.example.drafibe.dtos;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;

@Data
@AllArgsConstructor
@Builder
public class UserResponse {

    private String id;

    @JsonProperty("display_name")
    private String displayName;

    private String username;
    private String email;

    @JsonProperty("email_verified")
    private Integer emailVerified;

    private String phone;

    @JsonProperty("phone_verified")
    private Integer phoneVerified;

    private String status;

    private String avatar;

    @JsonProperty("created_at")
    private long createdAt;

    @JsonProperty("updated_at")
    private long updatedAt;

    @JsonProperty("auth_type")
    private String authType;

}
