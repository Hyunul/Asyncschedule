package com.aisg.devlogix.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.aisg.devlogix.model.Group;

public interface GroupRepository extends JpaRepository<Group, Long> {
    Optional<Group> findById(Long id);
}
