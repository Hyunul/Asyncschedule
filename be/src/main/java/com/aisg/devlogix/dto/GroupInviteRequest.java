package com.aisg.devlogix.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class GroupInviteRequest {
    private String requester;  // 초대를 요청한 사람 (리더)
    private String username;   // 초대할 사용자 이름
    private String groupName;  // 초대할 그룹 이름
}