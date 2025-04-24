package com.aisg.devlogix.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.aisg.devlogix.model.Group;
import com.aisg.devlogix.model.User;
import com.aisg.devlogix.repository.GroupRepository;
import com.aisg.devlogix.repository.UserRepository;

@Service
public class GroupService {

    @Autowired
    private GroupRepository groupRepository;

    @Autowired
    private UserRepository userRepository;

    public Group createGroup(String groupName, String ownerUsername) {
        Group group = new Group();
        group.setGroupname(groupName);
        group.setOwnername(ownerUsername);

        User owner = userRepository.findByUsername(ownerUsername)
                .orElseThrow(() -> new RuntimeException("User not found"));

        // group.getMembers().add(owner); // 생성자도 자동 가입
        return groupRepository.save(group);
    }

    public void addUserToGroup(String username, Long groupId) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Group group = groupRepository.findById(groupId)
                .orElseThrow(() -> new RuntimeException("Group not found"));

        // group.getMembers().add(user);
        groupRepository.save(group);
    }
}
