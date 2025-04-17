package com.aisg.devlogix.controller;

import org.springframework.web.bind.annotation.RestController;

import com.aisg.devlogix.dto.ScheduleDTO;
import com.aisg.devlogix.service.ScheduleService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;



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
    public ScheduleDTO getSchedule(@RequestParam String user) {
        return scheduleService.getSchedule(user);
    }
    
}
