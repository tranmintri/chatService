package com.example.drafibe.configs;

import org.apache.kafka.clients.producer.KafkaProducer;
import org.apache.kafka.common.serialization.StringSerializer;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.apache.kafka.clients.producer.ProducerConfig;

import java.util.Properties;

@Configuration
public class KafkaConfig {

    @Value("${kafka.bootstrap.servers}")
    private String BOOTSTRAP_SERVERS;

    @Value("${kafka.group.id}")
    private String GROUP_ID;

    @Bean
    public KafkaProducer<String, String> kafkaSender() {
        return new KafkaProducer<>(getKafkaProperties());
    }

    @Bean
    public Properties getKafkaProperties() {
        Properties properties = new Properties();
        properties.setProperty(ProducerConfig.BOOTSTRAP_SERVERS_CONFIG, BOOTSTRAP_SERVERS);
        properties.setProperty(ProducerConfig.KEY_SERIALIZER_CLASS_CONFIG, StringSerializer.class.getName());
        properties.setProperty(ProducerConfig.VALUE_SERIALIZER_CLASS_CONFIG, StringSerializer.class.getName());
        properties.put("group.id", GROUP_ID);
        return properties;
    }

}
