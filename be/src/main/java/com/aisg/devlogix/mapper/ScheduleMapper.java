package com.aisg.devlogix.mapper;

import java.time.LocalDate;
import java.util.List;
import java.util.Map;

import org.apache.ibatis.annotations.Mapper;

@Mapper
public interface ScheduleMapper {
    List<Map<String, Object>> getAllSchedule(String user, LocalDate startDate, LocalDate endDate, String gubun);

    List<Map<String, Object>> getRecomSchedule(LocalDate startDate, LocalDate endDate);
}
