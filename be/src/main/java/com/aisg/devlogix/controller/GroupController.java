package com.aisg.devlogix.controller;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
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

    @GetMapping
    public ResponseEntity<List<Map<String, Object>>> getGroups(@RequestParam String user) {
        Optional<User> userOpt = userRepository.findByUsername(user);
        if (userOpt.isEmpty()) {
            return ResponseEntity.badRequest().build();
        }
        
        List<Map<String, Object>> result = userOpt.get().getGroups().stream()
                .map(g -> {
                    Map<String, Object> map = new HashMap<>();
                    map.put("name", g.getName());
                    map.put("createdBy", g.getCreatedBy());
                    return map;
                })
                .collect(Collectors.toList());
        
        return ResponseEntity.ok(result);
    }

    @PostMapping
    public ResponseEntity<String> createGroup(@RequestBody Map<String, String> payload) {
        String groupName = payload.get("name");
        String username = payload.get("user");

        if (groupName == null || username == null) {
            return ResponseEntity.badRequest().body("Group name and username are required");
        }

        Optional<User> userOpt = userRepository.findByUsername(username);
        if (userOpt.isEmpty()) {
            return ResponseEntity.badRequest().body("User not found");
        }

        User user = userOpt.get();
        
        // 그룹 생성
        Group group = new Group();
        group.setName(groupName);
        group.setCreatedBy(username); // 생성자 기록
        groupRepository.save(group);

        // 관계 설정
        user.getGroups().add(group);
        userRepository.save(user);

        return ResponseEntity.ok("Group created successfully");
    }

    @PostMapping("/invite")
    public ResponseEntity<String> inviteUserToGroup(@RequestBody GroupInviteRequest request) {
        Optional<User> userOpt = userRepository.findByUsername(request.getUsername());
        Optional<Group> groupOpt = groupRepository.findByName(request.getGroupName());

        if (userOpt.isEmpty() || groupOpt.isEmpty()) {
            return ResponseEntity.badRequest().body("User or Group not found");
        }

        Group group = groupOpt.get();

        // 권한 확인: 요청자가 그룹 생성자인지 확인
        if (group.getCreatedBy() != null && !group.getCreatedBy().equals(request.getRequester())) {
            return ResponseEntity.status(403).body("Only the group creator can invite members.");
        }

        User user = userOpt.get();

        // 이미 속해있는지 확인
        if (user.getGroups().contains(group)) {
            return ResponseEntity.badRequest().body("User already in group");
        }

        // 사용자 그룹에 추가
        user.getGroups().add(group);
        userRepository.save(user);

        return ResponseEntity.ok("User invited to group successfully");
    }
}
