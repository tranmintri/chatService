package com.example.drafibe.models;

import com.example.drafibe.constants.ZoneId;
import jakarta.persistence.*;
import lombok.*;

import java.time.ZonedDateTime;
import java.util.UUID;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@EqualsAndHashCode(onlyExplicitlyIncluded = true)
@Entity
@Table(name = "users")
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @Column(length = 64)
    private String id;

    @Column(name = "display_name", length = 60)
    private String displayName;

    @Column(length = 60)
    private String username;

    @Column(length = 60)
    private String email;

    @Column(name = "email_verified")
    private Integer emailVerified;

    @Column(length = 16)
    private String phone;

    @Column(name = "phone_verified")
    private Integer phoneVerified;

    private String password;

    @Column(nullable = false)
    private UserStatus status;

    private String avatar;

    @Column(name = "created_at", nullable = false)
    private ZonedDateTime createdAt;

    @Column(name = "updated_at", nullable = false)
    private ZonedDateTime updatedAt;

    @Column(name = "deleted_at")
    private ZonedDateTime deletedAt;

    @Enumerated(EnumType.STRING)
    @Column(name = "auth_type")
    private AuthType authType;

    @PrePersist
    public void prePersist() {
        setCreatedAt(ZonedDateTime.now(ZoneId.UTC));
        setUpdatedAt(ZonedDateTime.now(ZoneId.UTC));
    }

    @PreUpdate
    public void preUpdate() {
        setUpdatedAt(ZonedDateTime.now(ZoneId.UTC));
    }

}