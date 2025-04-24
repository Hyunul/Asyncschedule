package com.aisg.devlogix.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.aisg.devlogix.model.Group;
import com.aisg.devlogix.service.GroupService;
import com.aisg.devlogix.util.JwtUtil;

@RestController
@RequestMapping("/api/groups")
public class GroupController {

    @Autowired
    private GroupService groupService;

    @Autowired
    private JwtUtil jwtUtil;

    @PostMapping("/create")
    public ResponseEntity<?> createGroup(@RequestParam String groupName, @RequestParam String ownerUsername) {
        Group group = groupService.createGroup(groupName, ownerUsername);
        return ResponseEntity.ok(group);
    }

    @GetMapping("/invite/{groupId}")
    public ResponseEntity<?> generateInvite(@PathVariable Long groupId) {
        String token = jwtUtil.generateInviteToken(String.valueOf(groupId));
        String inviteLink = "http://localhost:3000/invite?token=" + token;
        return ResponseEntity.ok(inviteLink);
    }

    @PostMapping("/join")
    public ResponseEntity<?> joinGroup(@RequestParam String token, @RequestParam String username) {
        try {
            String groupIdStr = jwtUtil.extractGroupId(token);
            groupService.addUserToGroup(username, Long.parseLong(groupIdStr));
            return ResponseEntity.ok("가입 성공!");
        } catch (Exception e) {
            return ResponseEntity.status(400).body("초대 실패: " + e.getMessage());
        }
    }
}

