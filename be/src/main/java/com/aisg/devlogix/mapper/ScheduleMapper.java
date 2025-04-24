package com.aisg.devlogix.mapper;

import java.util.List;
import java.util.Map;

import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

@Mapper
public interface ScheduleMapper {
    List<Map<String, Object>> getAllSchedule(@Param("user") String user, @Param("startDate") String startDate, @Param("endDate") String endDate, @Param("gubun") String gubun);
}
