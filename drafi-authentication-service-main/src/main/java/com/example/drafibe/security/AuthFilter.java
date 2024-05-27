package com.example.drafibe.security;

import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.ServletRequest;
import jakarta.servlet.ServletResponse;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.GenericFilterBean;

import java.io.IOException;

@Slf4j
@Component
@RequiredArgsConstructor
public class AuthFilter extends GenericFilterBean {

    private final ObjectMapper objectMapper;
//    private final AccessTokenHelper accessTokenHelper;

    @Override
    public void doFilter(ServletRequest request, ServletResponse response, FilterChain filterChain) throws IOException, ServletException {
        HttpServletRequest httpRequest = (HttpServletRequest) request;
        HttpServletResponse httpResponse = (HttpServletResponse) response;
        String accessToken = httpRequest.getHeader("Authorization");

        String requestPath = httpRequest.getRequestURI().substring(httpRequest.getContextPath().length());

        System.out.println(requestPath);

//        if (requestPath.matches("^/(signin|signup|signin/google|signup/google|logout|exists|verify/email|verify/email/send|forgot-password|reset-password)")) {
//            System.out.println("match");
//            filterChain.doFilter(request, response);
//            return;
//        }

        if(accessToken != null && !accessToken.isBlank()) {
            try {
//                AccessTokenPayload accessTokenPayload = accessTokenHelper.decodeAccessToken(accessToken);

//                log.info(accessTokenPayload.toString());

//                List<GrantedAuthority> authorities = new ArrayList<>();
//                authorities.add(new SimpleGrantedAuthority(accessTokenPayload.getSystemRole()));

//                UsernamePasswordAuthenticationToken authentication =
//                        new UsernamePasswordAuthenticationToken(
////                                accessTokenPayload,
////                                accessToken,
////                                authorities
//                        );
//
//                SecurityContextHolder.getContext()
//                        .setAuthentication(authentication);


            } catch (Exception ex) {
//                handleException(ex, httpResponse);
            }
        }

        filterChain.doFilter(request, response);
    }

//    private void handleException(Exception ex, HttpServletResponse response) {
//        try {
//            response.setContentType("application/json; charset=UTF-8");
//
//            ErrorResponse errorResponse = ErrorResponse.Builder.builder()
//                    .message(ex.getMessage())
//                    .build();
//
//            response.setStatus(406);
//            errorResponse.setCode("406");
//
//            objectMapper.writeValue(response.getOutputStream(), errorResponse);
//        } catch (IOException ioException) {
//            log.error("Dont send response", ioException);
//        }
//    }

}