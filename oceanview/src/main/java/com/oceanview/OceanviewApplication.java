package com.oceanview;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.data.mongodb.config.EnableMongoAuditing;

@SpringBootApplication
@EnableMongoAuditing
public class OceanviewApplication {

    public static void main(String[] args) {
        SpringApplication.run(OceanviewApplication.class, args);
    }

}
