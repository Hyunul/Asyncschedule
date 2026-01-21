package com.aisg.devlogix.dto;

import java.time.LocalDate;
import java.time.LocalTime;

import com.fasterxml.jackson.annotation.JsonFormat;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ScheduleEntry {
    private LocalDate date;
    
    @JsonFormat(pattern = "HH:mm")
    private LocalTime time;
}
