package com.example.drafibe.dtos;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Data;

@Data
public class SignUpWithGoogleRequest {

    private String token;

    @JsonProperty("display_name")
    private String displayName;

    private String username;

}
