package com.example.drafibe.services.impls;

import com.example.drafibe.dtos.*;
import com.example.drafibe.exceptions.NotFoundException;
import com.example.drafibe.models.LoginQRCodeRequest;
import com.example.drafibe.models.LoginQRCodeRequestStatus;
import com.example.drafibe.models.User;
import com.example.drafibe.repositories.LoginQRRequestRepository;
import com.example.drafibe.repositories.UserRepository;
import com.example.drafibe.services.QRService;
import com.example.drafibe.utils.TokenHelper;
import lombok.RequiredArgsConstructor;
import net.glxn.qrgen.QRCode;
import net.glxn.qrgen.image.ImageType;
import org.springframework.stereotype.Component;

import java.io.ByteArrayOutputStream;
import java.util.Map;
import java.util.UUID;

@Component
@RequiredArgsConstructor
public class QRServiceImpl implements QRService {

    private final LoginQRRequestRepository loginQRRequestRepository;
    private final UserRepository userRepository;

    @Override
    public GenerateLoginQRResponse generateLoginQRCode(GenerateLoginQRRequest request) {
        String id = UUID.randomUUID().toString();
        int size = 300;

        String token = TokenHelper.generateToken(id, 300, null);

        ByteArrayOutputStream stream = QRCode
                .from(token)
                .to(ImageType.PNG)
                .withSize(size, size)
                .stream();

        byte[] pngData = stream.toByteArray();

        String base64 = "data:image/png;base64, " + java.util.Base64.getEncoder().encodeToString(pngData);

        LoginQRCodeRequest loginQRCodeRequest = new LoginQRCodeRequest();
        loginQRCodeRequest.setId(id);
        loginQRCodeRequest.setToken(token);
        loginQRCodeRequest.setImage(base64);
        loginQRCodeRequest.setRequestInfo(Map.of(
                "os", request.getOs(),
                "device", request.getDevice(),
                "browser", request.getBrowser(),
                "ipAddress", request.getIpAddress(),
                "location", request.getLocation()
        ));

        loginQRRequestRepository.save(loginQRCodeRequest);

        return GenerateLoginQRResponse.builder()
                .id(id)
                .image(base64)
                .token(token)
                .build();
    }

    @Override
    public LoginQRCodeRequest scanLoginQRCode(ScanLoginQRRequest request) {
        if(!TokenHelper.validateToken(request.getToken())) {
            throw new RuntimeException("Invalid token");
        }

        User user = userRepository.findById(request.getUid())
                .orElseThrow(() -> new NotFoundException("User not found"));

        LoginQRCodeRequest loginQRCodeRequest = loginQRRequestRepository.findByToken(request.getToken());
        if(loginQRCodeRequest == null) {
            throw new NotFoundException("QR Code not found");
        }
        if(loginQRCodeRequest.getStatus() != LoginQRCodeRequestStatus.CREATED) {
            throw new RuntimeException("QR Code not created");
        }

        loginQRCodeRequest.setUserInfo(Map.of(
                "uid", request.getUid(),
                "username", user.getUsername(),
                "displayName", user.getDisplayName(),
                "avatar", user.getAvatar()
        ));
        loginQRCodeRequest.setStatus(LoginQRCodeRequestStatus.SCANNED);

        return loginQRRequestRepository.save(loginQRCodeRequest);
    }

    @Override
    public void confirmLoginQRCode(ConfirmLoginQRRequest request) {
        if(!TokenHelper.validateToken(request.getToken())) {
            throw new RuntimeException("Invalid token");
        }

        LoginQRCodeRequest loginQRCodeRequest = loginQRRequestRepository.findByToken(request.getToken());
        if(loginQRCodeRequest == null) {
            throw new NotFoundException("QR Code not found");
        }
        if(loginQRCodeRequest.getStatus() != LoginQRCodeRequestStatus.SCANNED) {
            throw new RuntimeException("QR Code not scanned");
        }

        loginQRCodeRequest.setStatus(LoginQRCodeRequestStatus.CONFIRMED);

        loginQRRequestRepository.save(loginQRCodeRequest);
    }

    @Override
    public void rejectLoginQRCode(RejectLoginQRRequest request) {
        LoginQRCodeRequest loginQRCodeRequest = loginQRRequestRepository.findByToken(request.getToken());
        if(loginQRCodeRequest == null) {
            throw new NotFoundException("QR Code not found");
        }

        loginQRCodeRequest.setStatus(LoginQRCodeRequestStatus.REJECTED);
        loginQRRequestRepository.save(loginQRCodeRequest);
    }

}
