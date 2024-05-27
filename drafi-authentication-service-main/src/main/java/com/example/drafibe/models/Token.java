package com.example.drafibe.models;

import com.example.drafibe.constants.ZoneId;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;

import java.time.ZonedDateTime;
import java.util.UUID;

@Data
@AllArgsConstructor
@Builder
@Entity
@Table(name = "tokens")
public class Token {

    @Id
    private String id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Column(columnDefinition = "text")
    private String token;

    @Column(name = "expired_at")
    private Long expiredAt;

    @Column(name = "issue_at")
    private Long issueAt;

    @Column(name = "refresh_token", columnDefinition = "text")
    private String refreshToken;

    @Enumerated(EnumType.STRING)
    private TokenType type;

    private Integer status;

    @Column(name = "created_at")
    private ZonedDateTime createdAt;

    @Column(name = "deleted_at")
    private ZonedDateTime deletedAt;

    public Token() {
        token = UUID.randomUUID().toString().replace("-", "");
        createdAt = ZonedDateTime.now(ZoneId.UTC);
    }
}