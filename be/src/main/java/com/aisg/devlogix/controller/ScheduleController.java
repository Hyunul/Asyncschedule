package com.aisg.devlogix.controller;

import java.time.DayOfWeek;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

import com.aisg.devlogix.dto.ScheduleDTO;
import com.aisg.devlogix.service.ScheduleService;
import com.aisg.devlogix.util.WeekUtils;



@RestController
@RequestMapping("/api")
public class ScheduleController {

    @Autowired
    private ScheduleService scheduleService;

    static WeekUtils.CustomWeek week = WeekUtils.getCustomWeek(LocalDate.now());
    DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd");
    String startDateStr = week.startDate.format(formatter);
    String endDateStr = week.endDate.format(formatter);

    @PostMapping("/schedule")
    @ResponseStatus(HttpStatus.CREATED)
    public void addSchedule(@RequestBody ScheduleDTO scheduleDTO) {
        scheduleService.addSchedule(scheduleDTO);
    }

    @GetMapping("/schedule")
    public List<Map<String, Object>> getSchedule(@RequestParam String user, String gubun) {
        return scheduleService.getSchedule(user, startDateStr, endDateStr, gubun);
    }

    @GetMapping("/schedule/recom")
    public ResponseEntity<String> getRecom(@RequestParam(required = false) String user, String gubun) {
        List<Map<String, Object>> list = scheduleService.getSchedule(user, startDateStr, endDateStr, gubun);

        double maxTime = -1;
        Map<String, Object> recomSchedule = null;

        for (Map<String, Object> item : list) {
            String timeStr = (String) item.get("time");
            if (timeStr != null) {
                String[] parts = timeStr.split(":");
                int hour = Integer.parseInt(parts[0]);
                int minute = Integer.parseInt(parts[1]);
                double timeVal = hour + (minute / 60.0);

                if (timeVal >= 19 && timeVal <= 21 && timeVal > maxTime) {
                    maxTime = timeVal;
                    recomSchedule = new HashMap<>(item);
                }
            }
        }

        if (recomSchedule != null) {
            String dateStr = (String) recomSchedule.get("date");
            String timeStr = (String) recomSchedule.get("time");
            LocalDate date = LocalDate.parse(dateStr, DateTimeFormatter.ofPattern("yyyy-MM-dd"));
            DayOfWeek dayOfWeek = date.getDayOfWeek();
            String koreanDay = getKoreanDay(dayOfWeek);
            String hourStr = timeStr.split(":")[0];
    
            String message = String.format("%s (%s) %s시", dateStr, koreanDay, hourStr);
            return ResponseEntity.ok(message);
        } else {
            return ResponseEntity.ok("추천 시간이 없습니다.");
        }
    }
    
    private String getKoreanDay(DayOfWeek dayOfWeek) {
    return switch (dayOfWeek) {
        case MONDAY -> "월요일";
        case TUESDAY -> "화요일";
        case WEDNESDAY -> "수요일";
        case THURSDAY -> "목요일";
        case FRIDAY -> "금요일";
        case SATURDAY -> "토요일";
        case SUNDAY -> "일요일";
    };
}
}
