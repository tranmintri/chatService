package com.example.drafibe.dtos;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class GenerateLoginQRRequest {

    private String os;
    private String browser;
    private String device;
    private String ipAddress;
    private String location;

}
