package com.aisg.devlogix.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class GroupInviteRequest {
    private Long userId;   // 초대할 사용자 ID
    private Long groupId;  // 초대할 그룹 ID
}