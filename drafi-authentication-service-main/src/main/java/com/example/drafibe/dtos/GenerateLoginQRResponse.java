package com.example.drafibe.dtos;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class GenerateLoginQRResponse {

    private String id;
    private String image;
    private String token;

}
