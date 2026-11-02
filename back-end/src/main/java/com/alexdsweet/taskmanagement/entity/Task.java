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
package com.alexdsweet.taskmanagement.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

import java.time.LocalDate;
import java.time.LocalDateTime;

import com.alexdsweet.taskmanagement.enums.TaskPriority;
import com.alexdsweet.taskmanagement.enums.TaskStatus;

@Entity
@Table(name = "tasks")
public class Task {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;

	@NotBlank(message = "Title must not be blank")
	@Size(max = 100, message = "Title must not exceed 100 characters")
	private String title;

	@Size(max = 500, message = "Description must not exceed 500 characters")
	private String description;

	@Enumerated(EnumType.STRING)
	@NotNull(message = "Status must not be null")
	private TaskStatus status = TaskStatus.TODO;
	
	@Enumerated(EnumType.STRING)
	@NotNull(message = "Priority must not be null")
	private TaskPriority priority = TaskPriority.MEDIUM;

	private LocalDateTime createdAt;

	private LocalDateTime updatedAt;
	
	@Column(name = "due_date")
	private LocalDate dueDate;

	@Column(name = "completed_at")
	private LocalDateTime completedAt;

	public Task() {
	}

	@PrePersist
	protected void onCreate() {
		createdAt = LocalDateTime.now();
		updatedAt = createdAt;
		
		if (status == TaskStatus.DONE && completedAt == null) {
			completedAt = createdAt;
		}
	}

	@PreUpdate
	protected void onUpdate() {
		updatedAt = LocalDateTime.now();
	}

	public Long getId() {
		return id;
	}

	public void setId(Long id) {
		this.id = id;
	}

	public String getTitle() {
		return title;
	}

	public void setTitle(String title) {
		this.title = title;
	}

	public String getDescription() {
		return description;
	}

	public void setDescription(String description) {
		this.description = description;
	}

	public TaskStatus getStatus() {
		return status;
	}

	public void setStatus(TaskStatus status) {
		this.status = status;
	}
	
	public TaskPriority getPriority() {
		return priority;
	}

	public void setPriority(TaskPriority priority) {
		this.priority = priority;
	}

	public LocalDateTime getCreatedAt() {
		return createdAt;
	}

	public LocalDateTime getUpdatedAt() {
		return updatedAt;
	}
	
	public LocalDate getDueDate() {
		return dueDate;
	}

	public void setDueDate(LocalDate dueDate) {
		this.dueDate = dueDate;
	}

	public LocalDateTime getCompletedAt() {
		return completedAt;
	}

	public void setCompletedAt(LocalDateTime completedAt) {
		this.completedAt = completedAt;
	}
}