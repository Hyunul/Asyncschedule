package com.aisg.devlogix.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.aisg.devlogix.model.Group;

public interface GroupRepository extends JpaRepository<Group, Long> {}