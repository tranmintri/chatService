package com.example.drafibe.services.impls;

import com.example.drafibe.dtos.UpdateAvatarRequest;
import com.example.drafibe.dtos.UpdateUserRequest;
import com.example.drafibe.dtos.UserResponse;
import com.example.drafibe.exceptions.NotFoundException;
import com.example.drafibe.mappers.UserMapper;
import com.example.drafibe.models.User;
import com.example.drafibe.repositories.UserRepository;
import com.example.drafibe.services.UserService;
import com.example.drafibe.utils.PasswordEncoder;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;
import software.amazon.awssdk.core.sync.RequestBody;
import software.amazon.awssdk.services.s3.S3Client;
import software.amazon.awssdk.services.s3.model.*;

import java.io.IOException;
import java.net.URL;
import java.util.HashMap;
import java.util.Map;
import java.util.UUID;

@Component
@RequiredArgsConstructor
public class UserServiceImpl implements UserService {

    private final UserRepository userRepository;
    private final S3Client s3;

    @Override
    public UserResponse getUserInfo(String id) {
        return userRepository.findById(id).map(UserMapper::toUserResponse)
                .orElseThrow(() -> new NotFoundException("User not found"));
    }

    @Override
    public UserResponse updateUserInfo(UpdateUserRequest request) {
        User user = userRepository.findById(request.getUid())
                .orElseThrow(() -> new NotFoundException(request.getUid()));

        if(request.getDisplayName() != null) {
            user.setDisplayName(request.getDisplayName());
        }

        if(request.getUsername() != null) {
            if(request.getUsername().isBlank())
                throw new RuntimeException("Username must be not blank");
//            if(!PasswordEncoder.matches(request.getPassword(), user.getPassword()))
//                throw new RuntimeException("Password not correct");
            if(userRepository.findUser(request.getUsername()).isPresent())
                throw new RuntimeException("Username is already exists");
            user.setUsername(request.getUsername());
        }

//        if(request.getEmail() != null) {
//            if(request.getEmail().isBlank())
//                throw new RuntimeException("Email must be not blank");
//            if(!PasswordEncoder.matches(request.getPassword(), user.getPassword()))
//                throw new RuntimeException("Password not correct");
//            if(userRepository.findByEmail(request.getEmail()).isPresent())
//                throw new RuntimeException("Email is already exists");
//            user.setEmail(request.getEmail());
//        }

        if(request.getPhone() != null) {
            if(request.getPhone().isBlank())
                throw new RuntimeException("Phone must be not blank");
//            if(!PasswordEncoder.matches(request.getPassword(), user.getPassword()))
//                throw new RuntimeException("Password not correct");
            if(userRepository.findByPhone(request.getPhone()).isPresent())
                throw new RuntimeException("Phone is already exists");
            user.setPhone(request.getPhone());
        }

        userRepository.save(user);

        return UserMapper.toUserResponse(user);
    }

    @Override
    public UserResponse updateAvatarInfo(UpdateAvatarRequest request) {
        try {
            User user = userRepository.findById(request.getUid())
                    .orElseThrow(() -> new NotFoundException(String.format("User with id %s not found", request.getUid())));

            String key = UUID.randomUUID().toString();

            Map<String, String> metadata = new HashMap<>();
            PutObjectRequest putObjectRequest = PutObjectRequest.builder()
                    .bucket("bucket11113")
                    .key(key)
                    .acl(ObjectCannedACL.PUBLIC_READ)
                    .metadata(metadata)
                    .build();

            PutObjectResponse putObjectResponse = s3.putObject(putObjectRequest, RequestBody.fromBytes(request.getAvatar().getBytes()));
            System.out.println(putObjectResponse.toString());

            GetUrlRequest getUrlRequest = GetUrlRequest.builder()
                    .bucket("bucket11113")
                    .key(key)
                    .build();

            URL url = s3.utilities().getUrl(getUrlRequest);

            user.setAvatar(url.toString());

            userRepository.save(user);

            System.out.println("URL");
            System.out.println(url.toString());

            return UserResponse.builder()
                    .avatar(url.toString())
                    .build();
        } catch (S3Exception | IOException ex) {
            throw new RuntimeException(ex);
        }
    }
}