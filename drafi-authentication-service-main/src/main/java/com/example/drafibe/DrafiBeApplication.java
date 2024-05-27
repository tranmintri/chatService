package com.example.drafibe;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cache.annotation.EnableCaching;

@EnableCaching
@SpringBootApplication
public class DrafiBeApplication {

	public static void main(String[] args) {
		SpringApplication.run(DrafiBeApplication.class, args);
	}

}
