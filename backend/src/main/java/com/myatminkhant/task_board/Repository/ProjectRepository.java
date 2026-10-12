package com.myatminkhant.task_board.Repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.myatminkhant.task_board.Entity.Project;

public interface ProjectRepository extends JpaRepository<Project,Long>{

    List<Project> findByOwnerId(Long owner_id);
}
