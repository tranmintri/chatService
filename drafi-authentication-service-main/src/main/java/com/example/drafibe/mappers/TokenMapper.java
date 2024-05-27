package com.example.drafibe.mappers;

import com.example.drafibe.dtos.AccessTokenResponse;
import com.example.drafibe.models.Token;

public class TokenMapper {

    public static AccessTokenResponse accessTokenResponse(Token token) {
        return AccessTokenResponse.builder()
                .tokenId(token.getId())
                .accessToken(token.getToken())
                .expirationAt(token.getExpiredAt())
                .refreshToken(token.getRefreshToken())
                .userInfo(UserMapper.toUserResponse(token.getUser()))
                .build();
    }

}