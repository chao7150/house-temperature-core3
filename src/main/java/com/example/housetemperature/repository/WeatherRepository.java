package com.example.housetemperature.repository;

import com.example.housetemperature.entity.Weather;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.time.OffsetDateTime;
import java.util.List;

@Repository
public interface WeatherRepository extends JpaRepository<Weather, OffsetDateTime> {
    List<Weather> findByDatetimeBetween(OffsetDateTime start, OffsetDateTime end);
}
