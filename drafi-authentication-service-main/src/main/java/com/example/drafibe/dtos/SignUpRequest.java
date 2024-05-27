package com.example.drafibe.dtos;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Data;

@Data
public class SignUpRequest {

    @JsonProperty("display_name")
    private String displayName;

    private String username;
    private String email;
    private String password;

}
