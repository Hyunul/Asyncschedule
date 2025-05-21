package com.aisg.devlogix.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ScheduleRequest {
    @NotBlank
    private String user;

    @NotBlank
    private String startDate;

    @NotBlank
    private String endDate;
    private String gubun; // null 일 수도 있음
}
