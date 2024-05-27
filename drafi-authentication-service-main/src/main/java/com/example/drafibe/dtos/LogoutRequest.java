package com.example.drafibe.dtos;

import com.fasterxml.jackson.annotation.JsonProperty;

public class LogoutRequest {

    @JsonProperty("token_id")
    private String tokenId;

}
