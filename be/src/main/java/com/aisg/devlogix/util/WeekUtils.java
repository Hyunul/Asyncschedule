package com.aisg.devlogix.util;

import java.time.DayOfWeek;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

public class WeekUtils {

    public static class DaySchedule {
        public LocalDate date;
        public String time; // null initially

        public DaySchedule(LocalDate date, String time) {
            this.date = date;
            this.time = time;
        }
    }

    public static class CustomWeek {
        public List<DaySchedule> week;
        public LocalDate startDate;
        public LocalDate endDate;

        public CustomWeek(List<DaySchedule> week, LocalDate startDate, LocalDate endDate) {
            this.week = week;
            this.startDate = startDate;
            this.endDate = endDate;
        }
    }

    public static CustomWeek getCustomWeek(LocalDate anchor) {
        // 수요일 기준으로 anchor 조정
        LocalDate startOfWeek;
        if (anchor.getDayOfWeek().getValue() <= DayOfWeek.WEDNESDAY.getValue()) {
            startOfWeek = anchor.with(DayOfWeek.WEDNESDAY);
        } else {
            startOfWeek = anchor.plusWeeks(1).with(DayOfWeek.WEDNESDAY);
        }

        List<DaySchedule> week = new ArrayList<>();
        for (int i = 0; i < 7; i++) {
            LocalDate currentDate = startOfWeek.plusDays(i);
            week.add(new DaySchedule(currentDate, null));
        }

        LocalDate startDate = week.get(0).date;
        LocalDate endDate = week.get(6).date;

        return new CustomWeek(week, startDate, endDate);
    }
}
