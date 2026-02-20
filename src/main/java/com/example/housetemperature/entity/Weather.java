package com.example.housetemperature.entity;

import jakarta.persistence.*;
import java.time.OffsetDateTime;

@Entity
@Table(name = "weather")
public class Weather {

    @Id
    @Column(name = "datetime")
    private OffsetDateTime datetime;

    @Column(name = "temperature", nullable = false)
    private Double temperature;

    @Column(name = "humidity", nullable = false)
    private Double humidity;

    @Column(name = "pressure", nullable = false)
    private Double pressure;

    public Weather() {
    }

    public Weather(OffsetDateTime datetime, Double temperature, Double humidity, Double pressure) {
        this.datetime = datetime;
        this.temperature = temperature;
        this.humidity = humidity;
        this.pressure = pressure;
    }

    public OffsetDateTime getDatetime() {
        return datetime;
    }

    public void setDatetime(OffsetDateTime datetime) {
        this.datetime = datetime;
    }

    public Double getTemperature() {
        return temperature;
    }

    public void setTemperature(Double temperature) {
        this.temperature = temperature;
    }

    public Double getHumidity() {
        return humidity;
    }

    public void setHumidity(Double humidity) {
        this.humidity = humidity;
    }

    public Double getPressure() {
        return pressure;
    }

    public void setPressure(Double pressure) {
        this.pressure = pressure;
    }
}