package com.example.drafibe.utils;

import com.auth0.jwt.JWT;
import com.auth0.jwt.JWTVerifier;
import com.auth0.jwt.algorithms.Algorithm;
import com.auth0.jwt.interfaces.DecodedJWT;
import com.example.drafibe.constants.ZoneId;
import com.example.drafibe.models.Token;
import com.example.drafibe.models.User;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.time.ZonedDateTime;
import java.util.Map;
import java.util.UUID;

@Service
public class TokenHelper {

    @Value("${spring.application.name}")
    private String applicationName;
    private static final String secret = "thanhtam1102";
    private static final Algorithm algorithm = Algorithm.HMAC256(secret);
    private static final JWTVerifier verifier = JWT.require(algorithm)
            .withIssuer("DraFi Authentication Service")
            .build();

    public Token generateToken(User user) {
        ZonedDateTime issuedAt = ZonedDateTime.now(ZoneId.UTC);
        ZonedDateTime expiredAt = issuedAt.plusSeconds(3000);
        ZonedDateTime refreshTokenExpiredAt = issuedAt.plusSeconds(7200);
        String tokenId = UUID.randomUUID().toString().replace("-", "");

        String token = JWT.create()
                .withIssuer("DraFi Authentication Service")
                .withSubject("Authentication")
                .withIssuedAt(issuedAt.toInstant())
                .withExpiresAt(expiredAt.toInstant())
                .withJWTId(tokenId)
                .withClaim("user_id", user.getId())
                .sign(algorithm);

        String refreshToken = JWT.create()
                .withIssuer(applicationName)
                .withSubject("Authentication")
                .withIssuedAt(issuedAt.toInstant())
                .withExpiresAt(refreshTokenExpiredAt.toInstant())
                .withJWTId(UUID.randomUUID().toString().replace("-", ""))
                .withClaim("user_id", user.getId())
                .sign(algorithm);

        return Token.builder()
                .id(tokenId)
                .user(user)
                .token(token)
                .issueAt(issuedAt.toEpochSecond())
                .expiredAt(expiredAt.toEpochSecond())
                .refreshToken(refreshToken)
                .createdAt(ZonedDateTime.now(ZoneId.UTC))
                .build();
    }

    public TokenPayload decodeToken(String token){
        DecodedJWT decodedJWT = verifier.verify(token);
        String uid = decodedJWT.getClaim("user_id").asString();
        return TokenPayload.builder()
                .uid(uid)
                .build();
    }


    // --------------------------------------------------------------------------------------------------
    // --------------------------------------------------------------------------------------------------


    public static String generateToken(String tokenId, long expirationTime, Map<String, Object> claims) {
        ZonedDateTime issuedAt = ZonedDateTime.now(ZoneId.UTC);
        ZonedDateTime expiredAt = issuedAt.plusSeconds(expirationTime);

        return JWT.create()
                .withIssuer("DraFi Authentication Service")
                .withSubject("Login QR Code Token")
                .withIssuedAt(issuedAt.toInstant())
                .withExpiresAt(expiredAt.toInstant())
                .withJWTId(tokenId)
                .withClaim("claims", claims)
                .sign(algorithm);
    }

    public static boolean validateToken(String token) {
        try {
            verifier.verify(token);
            return true;
        } catch (Exception ex) {
            return false;
        }
    }

}