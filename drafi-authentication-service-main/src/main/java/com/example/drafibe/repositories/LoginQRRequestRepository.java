package com.example.drafibe.repositories;

import com.example.drafibe.models.LoginQRCodeRequest;
import com.google.api.core.ApiFuture;
import com.google.cloud.firestore.*;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;

@Slf4j
@Component
@RequiredArgsConstructor
public class LoginQRRequestRepository {

    private final Firestore firestore;

    public LoginQRCodeRequest findById(String id) {
        LoginQRCodeRequest result = null;
        try {
            DocumentReference docRef = firestore.collection("LoginQRRequest").document(id);
            ApiFuture<DocumentSnapshot> apiFuture = docRef.get();
            DocumentSnapshot document = apiFuture.get();
            if(document.exists()) {
                result = document.toObject(LoginQRCodeRequest.class);
            }
        } catch (Exception ex) {
            log.error("Find LoginQRCodeRequest by Id error");
            log.error(ex.getLocalizedMessage());
            throw new RuntimeException("Find LoginQRCodeRequest by Id error");
        }
        return result;
    }

    public LoginQRCodeRequest findByToken(String token) {
        LoginQRCodeRequest result = null;
        try {
            Query query = firestore.collection("LoginQRRequest").whereEqualTo("token", token);
            ApiFuture<QuerySnapshot> apiFuture = query.get();
            QuerySnapshot querySnapshot = apiFuture.get();
            if(!querySnapshot.isEmpty()) {
                result = querySnapshot.toObjects(LoginQRCodeRequest.class).get(0);
            }
        } catch (Exception ex) {
            log.error("Find LoginQRCodeRequest by Token error");
            log.error(ex.getLocalizedMessage());
            throw new RuntimeException("Find LoginQRCodeRequest by Token error");
        }
        return result;
    }

    public LoginQRCodeRequest save(LoginQRCodeRequest request) {
        try {
            DocumentReference docRef = firestore.collection("LoginQRRequest").document(request.getId());
            ApiFuture<WriteResult> apiFuture = docRef.set(request);
            WriteResult writeResult = apiFuture.get();
            return request;
        } catch (Exception ex) {
            log.error("Save LoginQRCodeRequest error");
            log.error(ex.getLocalizedMessage());
            throw new RuntimeException("Save LoginQRCodeRequest error");
        }
    }

}
