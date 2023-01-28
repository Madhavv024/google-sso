package com.example.googlesso;


import org.springframework.web.bind.annotation.*;

@RestController("")
@RequestMapping(path = "/api/v1")
public class GoogleSSOController {
    @GetMapping("/")
    public String index() {
        return "Greetings from Spring Boot!\n";
    }

    @GetMapping("/authenticate")
    @CrossOrigin(origins = "http://localhost:3000")
    public String authenticate() {
        return "Authenticated!\n";
    }
}
