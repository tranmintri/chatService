package com.example.drafibe.services;

import com.example.drafibe.dtos.*;
import jakarta.validation.Valid;
import org.springframework.stereotype.Service;

@Service
public interface AuthService {

    boolean checkUserExists(CheckUserExistsRequest request);
    UserResponse signUpWithGoogle(SignUpWithGoogleRequest request);
    AccessTokenResponse signInWithGoogle(SignInWithGoogleRequest request);

    UserResponse signUp(SignUpRequest request);
    AccessTokenResponse signIn(SignInRequest request);
    AccessTokenResponse singInWithQRCode(SignInWithQRCodeRequest request);
    void logout(LogoutRequest request);

    void sendVerifyEmail(SendVerifyEmailRequest request);
    void verifyEmail(VerifyEmailRequest request);
    void forgotPassword(ForgotPasswordRequest request);
    void resetPassword(ResetPasswordRequest request);
    void changePassword(@Valid ChangePasswordRequest request);

}