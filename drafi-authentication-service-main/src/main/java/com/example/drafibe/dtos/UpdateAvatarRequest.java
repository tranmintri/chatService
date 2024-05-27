package com.example.drafibe.dtos;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;
import org.springframework.web.multipart.MultipartFile;

@Data
public class UpdateAvatarRequest {

    @NotBlank
    private String uid;

    @NotNull
    private MultipartFile avatar;

}
