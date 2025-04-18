package com.aisg.devlogix.controller;

import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

import com.aisg.devlogix.dto.ScheduleDTO;
import com.aisg.devlogix.service.ScheduleService;



@RestController
@RequestMapping("/api")
public class ScheduleController {

    @Autowired
    private ScheduleService scheduleService;

    @PostMapping("/schedule")
    @ResponseStatus(HttpStatus.CREATED)
    public void addSchedule(@RequestBody ScheduleDTO scheduleDTO) {
        scheduleService.addSchedule(scheduleDTO);
    }

    @GetMapping("/schedule")
    public List<Map<String, Object>> getSchedule(@RequestParam String user, String startDate, String endDate) {
        return scheduleService.getSchedule(user, startDate, endDate);
    }
    
}
