package com.example.drafibe.configs;

import com.mailersend.sdk.MailerSend;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.util.Properties;

@Configuration
public class MailSenderConfig {

    @Value("${spring.mail.host}")
    private String MAIL_HOST;

    @Value("${spring.mail.port}")
    private int MAIL_PORT;

    @Value("${spring.mail.username}")
    private String MAIL_USERNAME;

    @Value("${spring.mail.password}")
    private String MAIL_PASSWORD;

    @Value("${spring.mail.properties.mail.transport.protocol}")
    private String MAIL_TRANSPORT_PROTOCOL;

    @Value("${spring.mail.properties.mail.smtp.starttls.enable}")
    private String MAIL_STARTTLS_ENABLE;

    @Value("${spring.mail.properties.mail.smtp.auth}")
    private String MAIL_SMTP_AUTH;

    @Value("${spring.mail.properties.mail.debug}")
    private String MAIL_DEBUG;

    @Value("${mailersend.config.token}")
    private String MAILERSEND_TOKEN;

//    @Bean
//    public JavaMailSender getJavaMailSender() {
//        JavaMailSenderImpl mailSender = new JavaMailSenderImpl();
//        mailSender.setHost(MAIL_HOST);
//        mailSender.setPort(MAIL_PORT);
//
//        mailSender.setUsername(MAIL_USERNAME);
//        mailSender.setPassword(MAIL_PASSWORD);
//
//        Properties props = mailSender.getJavaMailProperties();
//        props.put("mail.transport.protocol", MAIL_TRANSPORT_PROTOCOL);
//        props.put("mail.smtp.auth", MAIL_SMTP_AUTH);
//        props.put("mail.smtp.starttls.enable", MAIL_STARTTLS_ENABLE);
//        props.put("mail.debug", MAIL_DEBUG);
//
//        return mailSender;
//    }

    @Bean
    public MailerSend mailerSend() {
        MailerSend ms = new MailerSend();
        ms.setToken(MAILERSEND_TOKEN);
        return ms;
    }

}
