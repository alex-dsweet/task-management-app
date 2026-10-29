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
package com.alexdsweet.taskmanagement.service;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;

import com.alexdsweet.taskmanagement.dto.TaskRequestDTO;
import com.alexdsweet.taskmanagement.dto.TaskResponseDTO;
import com.alexdsweet.taskmanagement.entity.Task;
import com.alexdsweet.taskmanagement.mapper.TaskMapper;
import com.alexdsweet.taskmanagement.repository.TaskRepository;

@Service
public class TaskService {
	private final TaskRepository mTaskRepository;
	private final TaskMapper mTaskMapper;

	public TaskService(TaskRepository inTaskRepository, TaskMapper inTaskMapper) {
		mTaskRepository = inTaskRepository;
		mTaskMapper = inTaskMapper;
	}

	public List<TaskResponseDTO> getAllTasks() {
		return mTaskRepository
				.findAll()
				.stream()
				.map(mTaskMapper::toResponse)
				.collect(Collectors.toList());
	}

	public Optional<TaskResponseDTO> getTaskById(Long id) {
		return mTaskRepository
				.findById(id)
				.map(mTaskMapper::toResponse);
	}

	public TaskResponseDTO createTask(TaskRequestDTO inTaskRequest) {
		Task task = mTaskMapper.toEntity(inTaskRequest);
		Task savedTask = mTaskRepository.save(task);
		return mTaskMapper.toResponse(savedTask);
	}

	public Optional<TaskResponseDTO> updateTask(Long id, TaskRequestDTO inTaskRequest) {
		return mTaskRepository.findById(id).map(existingTask -> {
			existingTask.setTitle(inTaskRequest.getTitle());
			existingTask.setDescription(inTaskRequest.getDescription());
			existingTask.setStatus(inTaskRequest.getStatus());

			Task updatedTask = mTaskRepository.save(existingTask);
			return mTaskMapper.toResponse(updatedTask);
		});
	}

	public void deleteTask(Long id) {
		mTaskRepository.deleteById(id);
	}
	
//	public void clearAllTasks() {
//		mTaskRepository.deleteAll();
//	}
}
