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

import com.aisg.devlogix.dto.ScheduleDTO;
import com.aisg.devlogix.service.ScheduleService;
import com.aisg.devlogix.util.WeekUtils;



@RestController
@RequestMapping("/api")
public class ScheduleController {

    @Autowired
    private ScheduleService scheduleService;

    static WeekUtils.CustomWeek week = WeekUtils.getCustomWeek(LocalDate.now());

    @PostMapping("/schedule")
    @ResponseStatus(HttpStatus.CREATED)
    public void addSchedule(@RequestBody ScheduleDTO scheduleDTO) {
        scheduleService.addSchedule(scheduleDTO);
    }

    @GetMapping("/schedule")
    public List<Map<String, Object>> getSchedule(@RequestParam String user, String gubun) {
        return scheduleService.getSchedule(user, week.startDate, week.endDate, gubun);
    }

    @GetMapping("/schedule/recom")
    public ResponseEntity<List<String>> getRecom(
            @RequestParam(required = false) String user) {

        // 주어진 주(startDate ~ endDate) 내의 추천 일정을 가져옵니다.
    List<Map<String, Object>> list = scheduleService.getRecom(week.startDate, week.endDate);
    List<String> matchedTimes = new ArrayList<>();

    // 시간 범위 설정: 19:00 ~ 21:00
    LocalTime startTime = LocalTime.of(19, 0);
    LocalTime endTime = LocalTime.of(21, 0);

    for (Map<String, Object> item : list) {
        // `java.sql.Time`을 `LocalTime`으로 변환
        Time timeSql = (Time) item.get("time");
        Date dateSql = (Date) item.get("date");

        if (timeSql != null && dateSql != null) {
            // `LocalTime`으로 변환
            LocalTime time = timeSql.toLocalTime();
            // `LocalDate`로 변환
            LocalDate date = dateSql.toLocalDate();

            // 시간 범위 필터링: 19:00 ~ 21:00 사이에 해당하는 시간만 필터링
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
