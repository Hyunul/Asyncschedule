package com.aisg.devlogix.service;

import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.aisg.devlogix.mapper.UserMapper;
import com.aisg.devlogix.repository.UserRepository;

@Service
public class UserService {
    @Autowired UserRepository userRepository;
    @Autowired UserMapper userMapper;

    public List<Map<String, Object>> getUserProfile(String username) {
        List<Map<String, Object>> list = userMapper.getUserProfile(username);
        return list;
    }
}
