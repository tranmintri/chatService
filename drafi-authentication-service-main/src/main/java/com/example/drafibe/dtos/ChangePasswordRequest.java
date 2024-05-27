package com.example.drafibe.dtos;

import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class ChangePasswordRequest {

    @NotBlank
    private String uid;

    @NotBlank
    @JsonProperty("current_password")
    private String currentPassword;

    @NotBlank
    @JsonProperty("new_password")
    private String newPassword;

}
