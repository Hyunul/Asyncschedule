package com.aisg.devlogix.service;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.stereotype.Service;

import com.aisg.devlogix.dto.ScheduleDTO;
import com.aisg.devlogix.dto.ScheduleEntry;
import com.aisg.devlogix.dto.ScheduleRequest;
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
        List<ScheduleEntry> entries = dto.getSchedule();

        List<LocalDate> dates = entries.stream()
            .map(ScheduleEntry::getDate)
            .collect(Collectors.toList());

        Map<LocalDate, Schedule> existingMap = scheduleRepository
            .findByUserAndDateIn(user, dates)
            .stream()
            .collect(Collectors.toMap(Schedule::getDate, s -> s));

        List<Schedule> toSave = new ArrayList<>();
        List<Schedule> toDelete = new ArrayList<>();

        for (ScheduleEntry entry : entries) {
            LocalDate date = entry.getDate();
            LocalTime time = entry.getTime();
            Schedule existing = existingMap.get(date);

            if (time == null) {
                if (existing != null) toDelete.add(existing);
            } else {
                if (existing != null) {
                    existing.setTime(time); // UPDATE
                    toSave.add(existing);
                } else {
                    Schedule s = new Schedule();
                    s.setDate(date);
                    s.setTime(time);
                    s.setUser(user);
                    toSave.add(s); // INSERT
                }
            }
        }

        if (!toDelete.isEmpty()) scheduleRepository.deleteAll(toDelete);
        if (!toSave.isEmpty()) scheduleRepository.saveAll(toSave);
    }
    
    public List<Map<String, Object>> getSchedule(ScheduleRequest scheduleRequest) {
        List<Map<String, Object>> list = scheduleMapper.getAllSchedule(scheduleRequest);
        return list;
    }

    @Cacheable(cacheNames = "recomSchedule", key = "#startDate.toString() + '-' + #endDate.toString()")
    public List<Map<String, Object>> getRecom(LocalDate startDate, LocalDate endDate) {
        List<Map<String, Object>> list = scheduleMapper.getRecomSchedule(startDate, endDate);
        return list;
    }
}
