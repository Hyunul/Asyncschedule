package com.aisg.devlogix.service;

import java.util.List;
import java.util.Map;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.aisg.devlogix.dto.ScheduleDTO;
import com.aisg.devlogix.dto.ScheduleEntry;
import com.aisg.devlogix.mapper.ScheduleMapper;
import com.aisg.devlogix.model.Schedule;
import com.aisg.devlogix.repository.ScheduleRepository;

import jakarta.transaction.Transactional;

@Service
public class ScheduleService {
    @Autowired private ScheduleRepository scheduleRepository;
    @Autowired private ScheduleMapper scheduleMapper;

    @Transactional
    public void addSchedule(ScheduleDTO dto) {
        String user = dto.getUser();

        for (ScheduleEntry entry : dto.getSchedule()) {
            String date = entry.getDate();
            String timeStr = entry.getTime();

            Optional<Schedule> existing = scheduleRepository.findByUserAndDate(user, date);

            if (timeStr == null || timeStr.isBlank()) {
                // ❌ time이 null → 기존 데이터가 있으면 삭제
                existing.ifPresent(scheduleRepository::delete);
            } else {
                if (existing.isPresent()) {
                    // ✅ UPDATE (시간만 변경)
                    Schedule schedule = existing.get();
                    schedule.setTime(timeStr);
                } else {
                    // ✅ INSERT (새 데이터 저장)
                    Schedule schedule = new Schedule();
                    schedule.setDate(date);
                    schedule.setTime(timeStr);
                    schedule.setUser(user);
                    scheduleRepository.save(schedule);
                }
            }
        }
    }
    
    public List<Map<String, Object>> getSchedule(String user, String startDate, String endDate, String gubun) {
        List<Map<String, Object>> list = scheduleMapper.getAllSchedule(user, startDate, endDate , gubun);
        return list;
    }
}
