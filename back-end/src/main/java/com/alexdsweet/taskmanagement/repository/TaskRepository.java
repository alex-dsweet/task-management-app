/**
 * Copyright (c) 2026 alex-dsweet.
 *
 * @author alex-dsweet
 * @since 2026
 *
 * This project is available for personal and educational use.
 * For commercial use, please contact me 
 * at 'conghau.contact@gmail.com' to obtain permission.
 */
package com.alexdsweet.taskmanagement.repository;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.alexdsweet.taskmanagement.entity.Task;
import com.alexdsweet.taskmanagement.entity.TaskStatus;

@Repository
public interface TaskRepository extends JpaRepository<Task, Long> {
	@Query("""
			SELECT t FROM Task t
			WHERE
			    (:keyword IS NULL OR
			        LOWER(t.title) LIKE LOWER(CONCAT('%', :keyword, '%')) OR
			        LOWER(t.description) LIKE LOWER(CONCAT('%', :keyword, '%')))
			    AND
			    (:status IS NULL OR t.status = :status)
			""")
	Page<Task> searchAndFilter(
				@Param("keyword") String keyword,
				@Param("status") TaskStatus status,
				Pageable pageable
		);
	
	long countByStatus(TaskStatus status);
}
