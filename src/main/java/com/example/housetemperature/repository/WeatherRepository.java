package com.example.housetemperature.repository;

import com.example.housetemperature.entity.Weather;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface WeatherRepository extends JpaRepository<Weather, LocalDateTime> {
    List<Weather> findByDatetimeBetween(LocalDateTime start, LocalDateTime end);
}
