package com.example.housetemperature.service;

import com.example.housetemperature.entity.Weather;
import com.example.housetemperature.repository.WeatherRepository;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.time.OffsetDateTime;
import java.time.LocalTime;
import java.time.ZoneOffset;
import java.util.List;

@Service
public class TemperatureService {

    private final WeatherRepository weatherRepository;

    @Value("${temppost.password}")
    private String tempPostPassword;

    public TemperatureService(WeatherRepository weatherRepository) {
        this.weatherRepository = weatherRepository;
    }

    public boolean validatePassword(String password) {
        return tempPostPassword != null && tempPostPassword.equals(password);
    }

    @Transactional
    public Weather saveWeather(Weather weather) {
        return weatherRepository.save(weather);
    }

    public List<Weather> getWeatherData(OffsetDateTime start, OffsetDateTime end) {
        return weatherRepository.findByDatetimeBetween(start, end);
    }

    public OffsetDateTime getDefaultStart() {
        return OffsetDateTime.of(OffsetDateTime.now(ZoneOffset.UTC).toLocalDate(), LocalTime.MIN, ZoneOffset.UTC);
    }

    public OffsetDateTime getDefaultEnd() {
        return getDefaultStart().plusDays(1);
    }
}