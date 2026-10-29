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
package com.alexdsweet.taskmanagement.mapper;

import org.springframework.stereotype.Component;

import com.alexdsweet.taskmanagement.dto.TaskRequestDTO;
import com.alexdsweet.taskmanagement.dto.TaskResponseDTO;
import com.alexdsweet.taskmanagement.entity.Task;

@Component
public class TaskMapper {
	public Task toEntity(TaskRequestDTO inTaskRequest) {
		Task task = new Task();
		task.setTitle(inTaskRequest.getTitle());
		task.setDescription(inTaskRequest.getDescription());
		task.setStatus(inTaskRequest.getStatus());
		return task;
	}

	public TaskResponseDTO toResponse(Task inTask) {
		return new TaskResponseDTO(
				inTask.getId(),
				inTask.getTitle(),
				inTask.getDescription(),
				inTask.getStatus(),
				inTask.getCreatedAt(),
				inTask.getUpdatedAt());
	}
}