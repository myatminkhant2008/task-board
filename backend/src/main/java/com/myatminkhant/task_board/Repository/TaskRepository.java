
package com.myatminkhant.task_board.Repository;


import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Page;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.myatminkhant.task_board.Entity.Task;
import com.myatminkhant.task_board.Enum.Status;

public interface TaskRepository extends JpaRepository<Task, Long> {

    @Query (
        value = """
                Select t from Task t
                Where t.project.id = :id
                AND (:status is NULL OR t.status = :status)
                AND (:search is NULL OR
                      Lower(t.title) Like Lower(Concat('%', :search ,'%'))
                      OR Lower(t.description) Like Lower(Concat('%' , :search ,'%'))
                    )
                """,
                countQuery = """
                             Select count(t) from Task t
                             Where t.project.id = :id
                             AND (:status is NULL OR t.status = :status)
                             AND (:search is NULL OR
                                  Lower(t.title) Like Lower(Concat('%', :search ,'%'))
                                  OR Lower(t.description) Like Lower(Concat('%' , :search ,'%'))
                                )
                             """
    )

    Page<Task> searchTask(
        @Param ("id") Long id,
        @Param ("search") String search,
        @Param ("status") Status status,
        Pageable pageable
    );
}
