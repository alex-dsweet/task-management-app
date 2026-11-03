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
		task.setPriority(inTaskRequest.getPriority());
		task.setDueDate(inTaskRequest.getDueDate());
		return task;
	}

	public TaskResponseDTO toResponse(Task inTask) {
		return TaskResponseDTO.builder()
				.id(inTask.getId())
				.title(inTask.getTitle())
				.description(inTask.getDescription())
				.status(inTask.getStatus())
				.priority(inTask.getPriority())
				.createdAt(inTask.getCreatedAt())
				.updatedAt(inTask.getUpdatedAt())
				.dueDate(inTask.getDueDate())
				.completedAt(inTask.getCompletedAt())
				.build();
	}
}