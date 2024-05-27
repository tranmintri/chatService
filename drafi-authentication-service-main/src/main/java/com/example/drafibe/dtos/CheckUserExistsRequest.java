package com.example.drafibe.dtos;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Data;

@Data
public class CheckUserExistsRequest {

    @JsonProperty("email_or_phone")
    private String emailOrPhone;

}
