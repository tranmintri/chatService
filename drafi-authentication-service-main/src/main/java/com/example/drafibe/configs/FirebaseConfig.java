//package com.example.drafibe.configs;
//
//import com.google.auth.oauth2.GoogleCredentials;
//import com.google.firebase.FirebaseApp;
//import com.google.firebase.FirebaseOptions;
//import org.springframework.core.io.ClassPathResource;
//import org.springframework.stereotype.Service;
//
//import javax.annotation.PostConstruct;
//import java.io.IOException;
//
//@Service
//public class FirebaseConfig {
//
//    @PostConstruct
//    public void initialize() throws IOException {
//        ClassPathResource serviceAccount = new ClassPathResource("firebase.json");
//
//        FirebaseOptions options = FirebaseOptions.builder()
//                .setCredentials(GoogleCredentials.fromStream(serviceAccount.getInputStream()))
//                .build();
//
//        if(FirebaseApp.getApps().isEmpty()) {
//            FirebaseApp.initializeApp(options);
//        }
//    }
//
//}
