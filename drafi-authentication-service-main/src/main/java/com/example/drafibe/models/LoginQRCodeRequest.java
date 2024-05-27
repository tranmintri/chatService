package com.example.drafibe.models;

import com.google.cloud.Timestamp;
import lombok.*;

import java.util.Map;

@Data
@AllArgsConstructor
@Builder
@EqualsAndHashCode(onlyExplicitlyIncluded = true)
public class LoginQRCodeRequest {

    @EqualsAndHashCode.Include
    private String id;

    private String token;

    private String image;

    private Map<String, String> requestInfo;

    private Map<String, Object> userInfo;

    private String loginToken;

    private LoginQRCodeRequestStatus status;

    private Timestamp createdAt;

    private Timestamp updatedAt;

    public LoginQRCodeRequest() {
        this.status = LoginQRCodeRequestStatus.CREATED;
        this.createdAt = Timestamp.now();
        this.updatedAt = Timestamp.now();
    }
}
