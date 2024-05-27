package com.example.drafibe.dtos;

import lombok.Data;

@Data
public class ResetPasswordRequest {

    private String token;
    private String password;

}
