package com.aisg.devlogix.repository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.aisg.devlogix.model.Schedule;

public interface ScheduleRepository extends JpaRepository<Schedule, Long> {
    List<Schedule> findScheduleByUser(String user);
    
    Optional<Schedule> findByUserAndDate(String user, LocalDate date);
    
    void delete(Schedule schedule);

}
