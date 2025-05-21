package com.aisg.devlogix.mapper;

import java.time.LocalDate;
import java.util.List;
import java.util.Map;

import org.apache.ibatis.annotations.Mapper;

import com.aisg.devlogix.dto.ScheduleRequest;

@Mapper
public interface ScheduleMapper {
    List<Map<String, Object>> getAllSchedule(ScheduleRequest scheduleRequest);

    List<Map<String, Object>> getRecomSchedule(LocalDate startDate, LocalDate endDate);
}
