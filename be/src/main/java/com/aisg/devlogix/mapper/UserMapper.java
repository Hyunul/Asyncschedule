package com.aisg.devlogix.mapper;

import java.util.List;
import java.util.Map;

import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

@Mapper
public interface UserMapper {
    List<Map<String, Object>> getUserProfile(@Param("username") String username);
}
