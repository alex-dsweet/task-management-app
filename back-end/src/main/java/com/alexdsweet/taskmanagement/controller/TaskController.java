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
package com.alexdsweet.taskmanagement.controller;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.alexdsweet.taskmanagement.dto.TaskRequestDTO;
import com.alexdsweet.taskmanagement.dto.TaskResponseDTO;
import com.alexdsweet.taskmanagement.service.TaskService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/tasks")
public class TaskController {
	private final TaskService mTaskService;

	public TaskController(TaskService inTaskService) {
		mTaskService = inTaskService;
	}

	@GetMapping
	public List<TaskResponseDTO> getAllTasks() {
		return mTaskService.getAllTasks();
	}

	@GetMapping("/{id}")
	public ResponseEntity<TaskResponseDTO> getTaskById(@PathVariable Long id) {
		return mTaskService
				.getTaskById(id)
				.map(ResponseEntity::ok)
				.orElse(ResponseEntity.notFound().build());
	}

	@PostMapping
	public ResponseEntity<TaskResponseDTO> createTask(@Valid @RequestBody TaskRequestDTO inTaskRequest) {
		TaskResponseDTO createdTask = mTaskService.createTask(inTaskRequest);
		return ResponseEntity.status(HttpStatus.CREATED).body(createdTask);
	}

	@PutMapping("/{id}")
	public ResponseEntity<TaskResponseDTO> updateTask(@PathVariable Long id,
			@Valid @RequestBody TaskRequestDTO inTaskRequest) {
		return mTaskService.updateTask(id, inTaskRequest)
				.map(ResponseEntity::ok)
				.orElse(ResponseEntity.notFound().build());
	}

	@DeleteMapping("/{id}")
	public ResponseEntity<Void> deleteTask(@PathVariable Long id) {
		mTaskService.deleteTask(id);
		return ResponseEntity.noContent().build();
	}
	
//	@DeleteMapping
//	public ResponseEntity<Void> clearAllTasks() {
//		mTaskService.clearAllTasks();
//		return ResponseEntity.noContent().build();
//	}
}