package com.example.drafibe.controllers;

import com.example.drafibe.dtos.*;
import com.example.drafibe.services.AuthService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;

    @GetMapping("/exists")
    public ResponseEntity<?> checkUserExists(@ModelAttribute CheckUserExistsRequest request) {
        return ResponseEntity.ok(authService.checkUserExists(request));
    }

    @PostMapping("/signup/google")
    public ResponseEntity<?> signupWithGoogle(@RequestBody SignUpWithGoogleRequest request) {
        return ResponseEntity.ok(authService.signUpWithGoogle(request));
    }

    @PostMapping("/signup")
    public ResponseEntity<?> signup(@RequestBody SignUpRequest request) {
        return ResponseEntity.ok(authService.signUp(request));
    }

    @PostMapping("/signin")
    public ResponseEntity<?> signin(@RequestBody SignInRequest request) {
        return ResponseEntity.ok(authService.signIn(request));
    }

    @PostMapping("/signin/qr")
    public ResponseEntity<?> signinWithQRCode(@RequestBody SignInWithQRCodeRequest request) {
        return ResponseEntity.ok(authService.singInWithQRCode(request));
    }

    @PostMapping("/logout")
    public ResponseEntity<?> logout(@RequestBody LogoutRequest request) {
        authService.logout(request);
        return ResponseEntity.ok("Logout success");
    }

    @PostMapping("/signin/google")
    public ResponseEntity<?> signInWithGoogle(@RequestBody SignInWithGoogleRequest request) {
        return ResponseEntity.ok(authService.signInWithGoogle(request));
    }

    @PostMapping("/verify/email/send")
    public ResponseEntity<?> sendVerifyEmail(@RequestBody SendVerifyEmailRequest request) {
        authService.sendVerifyEmail(request);
        return ResponseEntity.ok("Send verify email success");
    }

    @GetMapping("/verify/email")
    public ResponseEntity<?> verifyEmail(@ModelAttribute VerifyEmailRequest request) {
        System.out.println(request);
        authService.verifyEmail(request);
        return ResponseEntity.ok("Verify email success");
    }

    @PostMapping("/forgot-password")
    public ResponseEntity<?> forgotPassword(@RequestBody ForgotPasswordRequest request) {
        authService.forgotPassword(request);
        return ResponseEntity.ok("Send forgot password email success");
    }

    @PostMapping("/reset-password")
    public ResponseEntity<?> resetPassword(@RequestBody ResetPasswordRequest request) {
        authService.resetPassword(request);
        return ResponseEntity.ok("Reset password success");
    }

    @PutMapping("/change-password")
    public ResponseEntity<?> changePassword(@RequestBody ChangePasswordRequest request) {
        authService.changePassword(request);
        return ResponseEntity.ok("Change password success");
    }

}