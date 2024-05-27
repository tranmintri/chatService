package com.example.drafibe.controllers;

import com.example.drafibe.dtos.ConfirmLoginQRRequest;
import com.example.drafibe.dtos.GenerateLoginQRRequest;
import com.example.drafibe.dtos.RejectLoginQRRequest;
import com.example.drafibe.dtos.ScanLoginQRRequest;
import com.example.drafibe.services.QRService;
import com.example.drafibe.utils.AppUtil;
import eu.bitwalker.useragentutils.UserAgent;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/qr")
@RequiredArgsConstructor
public class QRController {

    private final QRService qrService;

    @PostMapping("/generate")
    public ResponseEntity<?> generateLoginQRCode(HttpServletRequest httpRequest) {
        String userAgentString = httpRequest.getHeader("User-Agent");
        UserAgent userAgent = UserAgent.parseUserAgentString(userAgentString);
        String os = userAgent.getOperatingSystem().getName();
        String browser = userAgent.getBrowser().getName();
        String device = userAgent.getOperatingSystem().getDeviceType().getName();
        String ipAddress = AppUtil.getIpAddress(httpRequest);

//        RestTemplate restTemplate = new RestTemplate();
//        String locationResponse = restTemplate.getForObject("https://freegeoip.app/json/" + ipAddress, String.class);
        String locationResponse = "{\"ip\":\"0.0.0.0\",\"country_code\":\"VN\",\"country_name\":\"Vietnam\",\"region_code\":\"VN-SG\",\"region_name\":\"Ho Chi Minh\",\"city\":\"Norwich\",\"zip_code\":\"NR1\",\"time_zone\":\"Asia\\/Ho_Chi_Minh\",\"latitude\":10.775059,\"longitude\":106.628219,\"metro_code\":0}";

        GenerateLoginQRRequest request = GenerateLoginQRRequest.builder()
                .os(os)
                .browser(browser)
                .device(device)
                .ipAddress(ipAddress)
                .location(locationResponse)
                .build();

        return ResponseEntity.ok(qrService.generateLoginQRCode(request));
    }

    @PostMapping("/scan")
    public ResponseEntity<?> scanLoginQRCode(@RequestBody ScanLoginQRRequest request) {
        return ResponseEntity.ok(qrService.scanLoginQRCode(request));
    }

    @PostMapping("/confirm")
    public ResponseEntity<?> confirmLoginQRCode(@RequestBody ConfirmLoginQRRequest request) {
        qrService.confirmLoginQRCode(request);
        return ResponseEntity.ok("Confirm Complete");
    }

    @PostMapping("/reject")
    public ResponseEntity<?> rejectLoginQRCode(@RequestBody RejectLoginQRRequest request) {
        qrService.rejectLoginQRCode(request);
        return ResponseEntity.ok("Reject Complete");
    }

}
