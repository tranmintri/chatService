package com.example.drafibe.utils;

import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

public class PasswordEncoder {

    private static final org.springframework.security.crypto.password.PasswordEncoder passwordEncoder = new BCryptPasswordEncoder();

    public static boolean matches(String rawPass, String encodePass) {
        return passwordEncoder.matches(rawPass, encodePass);
    }

    public static String encode(String rawPass) {
        return passwordEncoder.encode(rawPass);
    }

}