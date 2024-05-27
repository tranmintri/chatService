package com.example.drafibe.dtos;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;

@Data
@AllArgsConstructor
@Builder
public class AccessToken {

    @JsonProperty("access_token")
    private String accessToken;

    @JsonProperty("expiration_at")
    private long expirationAt;

    @JsonProperty("refresh_token")
    private String refreshToken;

    @JsonProperty("user_info")
    private UserResponse userInfo;

}
