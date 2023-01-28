package com.example.googlesso;


import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping(path = "/api/v1")
public class GoogleSSOController {
    @GetMapping("/")
    public String index() { return "{\"message\": \"OK\"\n}"; }

    @GetMapping("/authenticate")
    public String authenticate() {
        return "{\"message\": \"Authenticated\"\n}";
    }
}
