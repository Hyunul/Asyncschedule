package com.aisg.devlogix.controller;

import java.util.Optional;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.aisg.devlogix.dto.GroupInviteRequest;
import com.aisg.devlogix.model.Group;
import com.aisg.devlogix.model.User;
import com.aisg.devlogix.repository.GroupRepository;
import com.aisg.devlogix.repository.UserRepository;

@RestController
@RequestMapping("/api/groups")
public class GroupController {

    private final UserRepository userRepository;
    private final GroupRepository groupRepository;

    public GroupController(UserRepository userRepository, GroupRepository groupRepository) {
        this.userRepository = userRepository;
        this.groupRepository = groupRepository;
    }

    @PostMapping("/invite")
    public ResponseEntity<String> inviteUserToGroup(@RequestBody GroupInviteRequest request) {
        Optional<User> userOpt = userRepository.findById(request.getUserId());
        Optional<Group> groupOpt = groupRepository.findById(request.getGroupId());

        if (userOpt.isEmpty() || groupOpt.isEmpty()) {
            return ResponseEntity.badRequest().body("User or Group not found");
        }

        User user = userOpt.get();
        Group group = groupOpt.get();

        // 이미 속해있는지 확인
        if (user.getGroups().contains(group)) {
            return ResponseEntity.badRequest().body("User already in group");
        }

        // 사용자 그룹에 추가
        user.getGroups().add(group);
        userRepository.save(user);  // 변경사항 저장

        return ResponseEntity.ok("User invited to group successfully");
    }
}
