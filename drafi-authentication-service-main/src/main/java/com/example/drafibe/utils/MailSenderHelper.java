package com.example.drafibe.utils;

import com.mailersend.sdk.MailerSend;
import com.mailersend.sdk.MailerSendResponse;
import com.mailersend.sdk.emails.Email;
import com.mailersend.sdk.exceptions.MailerSendException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;

@Slf4j
@Component
@RequiredArgsConstructor
public class MailSenderHelper {

//    private final JavaMailSender emailSender;
    private final MailerSend ms;

    public void send(String to, String subject, String body) {
        Email email = new Email();

        email.setFrom("DraFi", "MS_mJjSTU@ntt1102.xyz");
        email.addRecipient("You", to);

        email.setSubject(subject);
        email.setHtml(body);

        try {
            MailerSendResponse response = ms.emails().send(email);
            System.out.println(response.messageId);
        } catch (MailerSendException e) {
            log.error("MailerSendException: Send email error");
            log.error(e.getMessage());
        }

//        try {
//            MimeMessage mail = emailSender.createMimeMessage();
//            MimeMessageHelper helper = new MimeMessageHelper(mail, true);
//
//            helper.setTo(to);
//            helper.setSubject(subject);
//            helper.setText(body, true);
//
//            emailSender.send(mail);
//        } catch (Exception ex) {
//            throw new RuntimeException("Send mail error");
//        }
    }

}