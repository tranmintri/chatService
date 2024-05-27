package com.example.drafibe.controllers;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.cloud.context.config.annotation.RefreshScope;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("")
@RefreshScope
public class MainController {

    @Value("${api.version}")
    private String version;

    @GetMapping
    public String apiInfo() {
        return "DraFi Authentication Service: " + version;
    }

}
