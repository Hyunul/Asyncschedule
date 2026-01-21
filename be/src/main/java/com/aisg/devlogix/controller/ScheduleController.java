package com.aisg.devlogix.controller;

import java.sql.Date;
import java.sql.Time;
import java.time.DayOfWeek;
import java.time.LocalDate;
import java.time.LocalTime;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
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
import org.springframework.web.bind.annotation.ModelAttribute;

import com.aisg.devlogix.dto.ScheduleDTO;
import com.aisg.devlogix.dto.ScheduleRequest;
import com.aisg.devlogix.service.ScheduleService;
import com.aisg.devlogix.util.WeekUtils;



import org.springframework.format.annotation.DateTimeFormat;

import java.sql.Timestamp;
import lombok.extern.slf4j.Slf4j;

@RestController
@RequestMapping("/api")
@Slf4j
public class ScheduleController {

    @Autowired
    private ScheduleService scheduleService;

    @PostMapping("/schedule")
    @ResponseStatus(HttpStatus.CREATED)
    public void addSchedule(@RequestBody ScheduleDTO scheduleDTO) {
        scheduleService.addSchedule(scheduleDTO);
    }

    @GetMapping("/schedule")
    public List<Map<String, Object>> getSchedule(@ModelAttribute ScheduleRequest scheduleRequest) {
        return scheduleService.getSchedule(scheduleRequest);
    }

    @GetMapping("/schedule/recom")
    public ResponseEntity<List<String>> getRecom(
            @RequestParam(required = false) String user,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate) {
        
        LocalDate start, end;
        if (startDate != null && endDate != null) {
            start = startDate;
            end = endDate;
        } else {
            WeekUtils.CustomWeek week = WeekUtils.getCustomWeek(LocalDate.now());
            start = week.startDate;
            end = week.endDate;
        }

        log.info("Requesting Recom Schedule for: {} ~ {}", start, end);

        // 주어진 주(startDate ~ endDate) 내의 추천 일정을 가져옵니다.
        List<Map<String, Object>> list = scheduleService.getRecom(start, end);
        log.info("Fetched {} items from service.", list.size());
        
        List<String> matchedTimes = new ArrayList<>();

        // 시간 범위 설정: 19:00 ~ 21:00
        LocalTime startTime = LocalTime.of(19, 0);
        LocalTime endTime = LocalTime.of(21, 0);

        for (Map<String, Object> item : list) {
            // Safely parse Time
            Object timeObj = item.get("time");
            LocalTime time = null;
            if (timeObj instanceof Time) {
                time = ((Time) timeObj).toLocalTime();
            } else if (timeObj instanceof LocalTime) {
                time = (LocalTime) timeObj;
            } else if (timeObj instanceof String) {
                time = LocalTime.parse((String) timeObj);
            }

            // Safely parse Date
            Object dateObj = item.get("date");
            LocalDate date = null;
            if (dateObj instanceof Date) {
                date = ((Date) dateObj).toLocalDate();
            } else if (dateObj instanceof LocalDate) {
                date = (LocalDate) dateObj;
            } else if (dateObj instanceof String) {
                date = LocalDate.parse((String) dateObj);
            } else if (dateObj instanceof Long) {
                date = new Date((Long) dateObj).toLocalDate();
            } else if (dateObj instanceof Timestamp) {
                date = ((Timestamp) dateObj).toLocalDateTime().toLocalDate();
            }

            if (time != null && date != null) {            // 시간 범위 필터링: 19:00 ~ 21:00 사이에 해당하는 시간만 필터링
            if (!time.isBefore(startTime) && !time.isAfter(endTime)) {
                DayOfWeek dayOfWeek = date.getDayOfWeek();
                String koreanDay = getKoreanDay(dayOfWeek);

                // 날짜 포맷팅
                String formattedDate = date.format(DateTimeFormatter.ofPattern("yyyy-MM-dd"));
                // 시간 포맷팅
                String formattedTime = time.format(DateTimeFormatter.ofPattern("HH시"));

                // 메시지 생성
                String message = String.format("%s (%s) %s", formattedDate, koreanDay, formattedTime);
                matchedTimes.add(message);
            }
        }
    }

        if (matchedTimes.isEmpty()) {
            return ResponseEntity.ok(List.of("추천 시간이 없습니다."));
        }

        return ResponseEntity.ok(matchedTimes);
    }

    
    private String getKoreanDay(DayOfWeek dayOfWeek) {
    return switch (dayOfWeek) {
        case MONDAY -> "월";
        case TUESDAY -> "화";
        case WEDNESDAY -> "수";
        case THURSDAY -> "목";
        case FRIDAY -> "금";
        case SATURDAY -> "토";
        case SUNDAY -> "일";
    };
}
}
