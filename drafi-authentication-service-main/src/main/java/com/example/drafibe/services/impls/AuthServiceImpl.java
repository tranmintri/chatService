package com.example.drafibe.services.impls;

import com.example.drafibe.constants.ZoneId;
import com.example.drafibe.dtos.*;
import com.example.drafibe.exceptions.NotFoundException;
import com.example.drafibe.exceptions.UnauthenticatedException;
import com.example.drafibe.exceptions.UserAlreadyExistsException;
import com.example.drafibe.mappers.TokenMapper;
import com.example.drafibe.mappers.UserMapper;
import com.example.drafibe.models.*;
import com.example.drafibe.repositories.LoginQRRequestRepository;
import com.example.drafibe.repositories.TokenRepository;
import com.example.drafibe.repositories.UserRepository;
import com.example.drafibe.services.AuthService;
import com.example.drafibe.utils.TokenPayload;
import com.example.drafibe.utils.TokenHelper;
import com.example.drafibe.utils.MailSenderHelper;
import com.example.drafibe.utils.PasswordEncoder;
import com.google.firebase.auth.FirebaseAuth;
import com.google.firebase.auth.FirebaseToken;
import com.google.gson.Gson;
import lombok.RequiredArgsConstructor;
import org.apache.kafka.clients.producer.KafkaProducer;
import org.apache.kafka.clients.producer.ProducerRecord;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.Resource;
import org.springframework.core.io.ResourceLoader;
import org.springframework.stereotype.Component;
import org.springframework.util.FileCopyUtils;

import java.time.ZonedDateTime;

@Component
@RequiredArgsConstructor
public class AuthServiceImpl implements AuthService {

    @Value("${access-token.expiration-time}")
    private int accessTokenExpirationTime;

    @Value("${refresh-token.expiration-time}")
    private int refreshTokenExpirationTime;

    private final String TOPIC = "newuser";

    private final KafkaProducer<String, String> producer;
    private final UserRepository userRepository;
    private final LoginQRRequestRepository loginQRRequestRepository;
    private final TokenRepository tokenRepository;
    private final MailSenderHelper mailSenderHelper;
    private final ResourceLoader resourceLoader;
    private final TokenHelper tokenHelper = new TokenHelper();

    @Override
    public boolean checkUserExists(CheckUserExistsRequest request) {
        return userRepository.findUser(request.getEmailOrPhone()).isPresent();
    }

    @Override
    public UserResponse signUpWithGoogle(SignUpWithGoogleRequest request) {
        try {
            FirebaseToken decodedToken = FirebaseAuth.getInstance().verifyIdToken(request.getToken());
            String email = decodedToken.getEmail();

            if(userRepository.findUser(email).isPresent()) {
                throw new UserAlreadyExistsException(String.format("User with email %s already exists", email));
            }

            User user = new User();
            user.setDisplayName(request.getDisplayName());
            user.setUsername(request.getUsername());
            user.setEmail(email);
            user.setEmailVerified(1);
            user.setStatus(UserStatus.ACTIVE);
            user.setAvatar("https://ps.w.org/user-avatar-reloaded/assets/icon-256x256.png?rev=2540745");
            user.setAuthType(AuthType.GOOGLE_AUTH);

            userRepository.save(user);
            System.out.println("signup google");
            sendUserToKafka(user);

            return UserMapper.toUserResponse(user);
        } catch (Exception ex) {
            throw new RuntimeException(ex.getMessage());
        }
    }

    @Override
    public AccessTokenResponse signInWithGoogle(SignInWithGoogleRequest request) {
        try {
            FirebaseToken decodedToken = FirebaseAuth.getInstance().verifyIdToken(request.getToken());
            String email = decodedToken.getEmail();

            User user = userRepository.findUser(email)
                    .orElseThrow(() -> new NotFoundException("User not found"));
            System.out.println("sign in google");


            Token token = tokenHelper.generateToken(user);
            token.setType(TokenType.ACCESS_TOKEN);

            tokenRepository.save(token);

            return TokenMapper.accessTokenResponse(token);
        } catch (Exception ex) {
            throw new RuntimeException(ex.getMessage());
        }
    }

    @Override
    public UserResponse signUp(SignUpRequest request) {
        if(userRepository.findUser(request.getEmail()).isPresent()) {
            throw new UserAlreadyExistsException(String.format("User with email %s already exists", request.getEmail()));
        }

        User user = new User();
        user.setDisplayName(request.getDisplayName());
        user.setEmail(request.getEmail());
        user.setUsername(request.getUsername());
        user.setPassword(PasswordEncoder.encode(request.getPassword()));
        user.setEmailVerified(0);
        user.setStatus(UserStatus.ACTIVE);
        user.setAvatar("https://ps.w.org/user-avatar-reloaded/assets/icon-256x256.png?rev=2540745");
        user.setAuthType(AuthType.USERNAME_PASSWORD);

        userRepository.save(user);

        sendUserToKafka(user);

        Thread thread = new Thread(() -> {
            SendVerifyEmailRequest sendVerifyEmailRequest = new SendVerifyEmailRequest();
            sendVerifyEmailRequest.setEmail(request.getEmail());
            sendVerifyEmail(sendVerifyEmailRequest);
        });
        thread.start();

        return UserMapper.toUserResponse(user);
    }

    @Override
    public AccessTokenResponse signIn(SignInRequest request) {
        User user = userRepository.findUser(request.getUsername())
                .orElseThrow(() -> new UnauthenticatedException("Username or password not correct"));

        if(!PasswordEncoder.matches(request.getPassword(), user.getPassword())) {
            throw new UnauthenticatedException("Username or password not correct");
        }

        if(user.getStatus() == UserStatus.DISABLE) {
            throw new UnauthenticatedException("User has been locked");
        }

        Token token = tokenHelper.generateToken(user);
        token.setType(TokenType.ACCESS_TOKEN);

        tokenRepository.save(token);

        return TokenMapper.accessTokenResponse(token);
    }

    @Override
    public AccessTokenResponse singInWithQRCode(SignInWithQRCodeRequest request) {
        LoginQRCodeRequest loginQRCodeRequest = loginQRRequestRepository.findByToken(request.getToken());
        if(loginQRCodeRequest == null) {
            throw new NotFoundException("QR Code not found");
        }

        if(loginQRCodeRequest.getStatus() != LoginQRCodeRequestStatus.CONFIRMED) {
            throw new RuntimeException("QR Code not confirmed");
        }

        String uid = (String) loginQRCodeRequest.getUserInfo().get("uid");
        if(uid == null) {
            throw new RuntimeException("UserId not found");
        }

        User user = userRepository.findById(uid)
                .orElseThrow(() -> new NotFoundException("User not found"));

        Token token = tokenHelper.generateToken(user);
        token.setType(TokenType.ACCESS_TOKEN);

        tokenRepository.save(token);

        return TokenMapper.accessTokenResponse(token);
    }


    @Override
    public void logout(LogoutRequest request) {

    }


    @Override
    public void sendVerifyEmail(SendVerifyEmailRequest request) {
        try {
            User user = userRepository.findUser(request.getEmail())
                    .orElseThrow(() -> new NotFoundException("User not found"));

            Token token = tokenHelper.generateToken(user);
            token.setType(TokenType.VERIFY_EMAIL_TOKEN);

            tokenRepository.save(token);

            Resource resource = resourceLoader.getResource("classpath:templates/verify-email-template.html");
            String verifyEmailTemplate = new String(FileCopyUtils.copyToByteArray(resource.getInputStream()));
            verifyEmailTemplate = verifyEmailTemplate.replace(
                    "${VERIFY_URL}",
                    String.format("https://drafi-web.vercel.app/verify/email?token=%s", token.getToken())
            );

            mailSenderHelper.send(
                    request.getEmail(),
                    "DraFi: Verify Email",
                    verifyEmailTemplate
            );
        } catch (Exception ex) {
            System.out.println(ex);
            throw new RuntimeException("Send verify email error");
        }
    }

    @Override
    public void verifyEmail(VerifyEmailRequest request) {
        Token token = tokenRepository.findByToken(request.getToken())
                .orElseThrow(() -> new NotFoundException("Token not found"));

        TokenPayload payload = tokenHelper.decodeToken(request.getToken());

        User user = userRepository.findById(payload.getUid())
                .orElseThrow(() -> new NotFoundException(String.format("User with id %s not found", payload.getUid())));

        if(user.getEmailVerified() == 0) {
            user.setEmailVerified(1);
            user.setUpdatedAt(ZonedDateTime.now(ZoneId.UTC));

            userRepository.save(user);
            sendUserToKafka(user);
        }
    }

    @Override
    public void forgotPassword(ForgotPasswordRequest request) {
        try {
            User user = userRepository.findUser(request.getEmail())
                    .orElseThrow(() -> new NotFoundException("User not found"));

            Token token = tokenHelper.generateToken(user);
            token.setType(TokenType.FORGOT_PASSWORD_TOKEN);

            tokenRepository.save(token);

            Resource resource = resourceLoader.getResource("classpath:templates/forgot-pass-email-template.html");
            String forgotPassEmailTemplate = new String(FileCopyUtils.copyToByteArray(resource.getInputStream()));
            forgotPassEmailTemplate = forgotPassEmailTemplate.replace(
                    "${FORGOT_PASS_URL}",
                    String.format("https://drafi-web.vercel.app/reset-password?token=%s", token.getToken())
            );
            forgotPassEmailTemplate = forgotPassEmailTemplate.replace(
                    "${USER_EMAIL}",
                    user.getEmail()
            );

            mailSenderHelper.send(
                    request.getEmail(),
                    "DraFi: Reset Password",
                    forgotPassEmailTemplate
            );
        } catch (Exception ex) {
            System.out.println(ex);
            throw new RuntimeException("Send forgot password email error");
        }
    }

    @Override
    public void resetPassword(ResetPasswordRequest request) {
        Token token = tokenRepository.findByToken(request.getToken())
                .orElseThrow(() -> new NotFoundException("Token not found"));

        TokenPayload payload = tokenHelper.decodeToken(request.getToken());

        User user = userRepository.findById(payload.getUid())
                .orElseThrow(() -> new NotFoundException(String.format("User with id %s not found", payload.getUid())));

        user.setPassword(PasswordEncoder.encode(request.getPassword()));
        user.setUpdatedAt(ZonedDateTime.now(ZoneId.UTC));

        userRepository.save(user);
        sendUserToKafka(user);

    }

    @Override
    public void changePassword(ChangePasswordRequest request) {
        User user = userRepository.findById(request.getUid())
                .orElseThrow(() -> new NotFoundException(String.format("User with id %s not found", request.getUid())));

        if(!PasswordEncoder.matches(request.getCurrentPassword(), user.getPassword())) {
            throw new RuntimeException("Current password not correct");
        }

        user.setPassword(PasswordEncoder.encode(request.getNewPassword()));
        userRepository.save(user);
        sendUserToKafka(user);
    }
    private void sendUserToKafka(User user) {
        try {
            Gson gson = new Gson();
            // Convert user object thành chuỗi JSON
            String userJson = gson.toJson(UserMapper.toUserResponse(user));

            // Tạo một record Kafka với key là ID của user và value là chuỗi JSON của user
            ProducerRecord<String, String> record = new ProducerRecord<>(TOPIC, user.getId(), userJson);

            // Gửi record đến Kafka
            producer.send(record);

            System.out.println("User sent to Kafka: " + userJson);
        } catch (Exception ex) {
            System.err.println("Error sending user to Kafka: " + ex.getMessage());
        }
    }

}