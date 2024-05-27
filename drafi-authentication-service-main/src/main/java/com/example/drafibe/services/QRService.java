package com.example.drafibe.services;

import com.example.drafibe.dtos.*;
import com.example.drafibe.models.LoginQRCodeRequest;

public interface QRService {

    GenerateLoginQRResponse generateLoginQRCode(GenerateLoginQRRequest request);
    LoginQRCodeRequest scanLoginQRCode(ScanLoginQRRequest request);
    void confirmLoginQRCode(ConfirmLoginQRRequest request);
    void rejectLoginQRCode(RejectLoginQRRequest request);

}
