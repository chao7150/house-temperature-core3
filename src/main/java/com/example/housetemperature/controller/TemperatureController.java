package com.example.housetemperature.controller;

import com.example.housetemperature.entity.Weather;
import com.example.housetemperature.service.TemperatureService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

@RestController
public class TemperatureController {
    
    private final TemperatureService temperatureService;
    
    public TemperatureController(TemperatureService temperatureService) {
        this.temperatureService = temperatureService;
    }
    
    @PostMapping("/api/temperature")
    public ResponseEntity<?> postTemperature(
            @RequestHeader(value = "X-Temppost-Password", required = false) String password,
            @RequestBody Map<String, Object> body) {
        
        if (!temperatureService.validatePassword(password)) {
            return ResponseEntity.status(401)
                    .body(Map.of("title", "incorrect password", "detail", "Password is incorrect."));
        }
        
        if (!isValidBody(body)) {
            return ResponseEntity.status(400)
                    .body(Map.of("title", "request body is invalid", 
                            "detail", "Request body must contain datetime, temperature, humidity and pressure."));
        }
        
        LocalDateTime datetime = LocalDateTime.ofInstant(
                java.time.Instant.ofEpochMilli(((Number) body.get("datetime")).longValue()),
                java.time.ZoneOffset.UTC);
        
        Weather weather = new Weather(
                datetime,
                ((Number) body.get("temperature")).doubleValue(),
                ((Number) body.get("humidity")).doubleValue(),
                ((Number) body.get("pressure")).doubleValue());
        
        Weather saved = temperatureService.saveWeather(weather);
        return ResponseEntity.ok(saved);
    }
    
    @GetMapping("/api/temperature")
    public ResponseEntity<List<Weather>> getTemperature(
            @RequestParam(required = false) String start,
            @RequestParam(required = false) String end) {
        
        LocalDateTime startDateTime = start != null ? LocalDateTime.parse(start) : temperatureService.getDefaultStart();
        LocalDateTime endDateTime = end != null ? LocalDateTime.parse(end) : temperatureService.getDefaultEnd();
        
        List<Weather> data = temperatureService.getWeatherData(startDateTime, endDateTime);
        return ResponseEntity.ok(data);
    }
    
    @GetMapping("/status")
    public ResponseEntity<Map<String, String>> status() {
        return ResponseEntity.ok(Map.of("status", "OK"));
    }
    
    private boolean isValidBody(Map<String, Object> body) {
        return body.containsKey("datetime") 
                && body.containsKey("temperature")
                && body.containsKey("humidity")
                && body.containsKey("pressure");
    }
}