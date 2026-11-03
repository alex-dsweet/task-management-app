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

import java.time.LocalDateTime;
import java.util.Optional;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import com.alexdsweet.taskmanagement.dto.TaskRequestDTO;
import com.alexdsweet.taskmanagement.dto.TaskResponseDTO;
import com.alexdsweet.taskmanagement.dto.TaskStatisticsDTO;
import com.alexdsweet.taskmanagement.entity.Task;
import com.alexdsweet.taskmanagement.enums.TaskPriority;
import com.alexdsweet.taskmanagement.enums.TaskStatus;
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

	public Page<TaskResponseDTO> getAllTasks(int page, int size, String sortBy, String direction, String keyword,
			TaskStatus status, TaskPriority priority) {

		String normalizedKeyword = (keyword == null || keyword.isBlank()) ? null : keyword.trim();

		Sort sort = direction.equalsIgnoreCase("asc") 
						? Sort.by(sortBy).ascending()
						: Sort.by(sortBy).descending();

		PageRequest pageRequest = PageRequest.of(page, size, sort);

		return mTaskRepository.searchAndFilter(normalizedKeyword, status, priority, pageRequest)
				.map(mTaskMapper::toResponse);
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
			existingTask.setPriority(inTaskRequest.getPriority());
			existingTask.setDueDate(inTaskRequest.getDueDate());
			
			TaskStatus oldStatus = existingTask.getStatus();
			TaskStatus newStatus = inTaskRequest.getStatus();
			if (newStatus == TaskStatus.DONE) {
				if (oldStatus != TaskStatus.DONE || existingTask.getCompletedAt() == null) {
					existingTask.setCompletedAt(LocalDateTime.now());
				}
			} else {
				existingTask.setCompletedAt(null);
			}

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
	
	public TaskStatisticsDTO getTaskStatistics() {
		long totalTasks = mTaskRepository.count();
		long todoTasks = mTaskRepository.countByStatus(TaskStatus.TODO);
		long inProgressTasks = mTaskRepository.countByStatus(TaskStatus.IN_PROGRESS);
		long doneTasks = mTaskRepository.countByStatus(TaskStatus.DONE);

		return new TaskStatisticsDTO(totalTasks, todoTasks, inProgressTasks, doneTasks);
	}
}