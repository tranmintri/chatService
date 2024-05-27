package com.example.drafibe.dtos;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Data;
import org.springframework.web.multipart.MultipartFile;

@Data
public class UpdateUserRequest {

    private String uid;

    @JsonProperty("display_name")
    private String displayName;

    private String username;

    private String email;

    private String phone;

    private String password;

    private MultipartFile avatar;

}
