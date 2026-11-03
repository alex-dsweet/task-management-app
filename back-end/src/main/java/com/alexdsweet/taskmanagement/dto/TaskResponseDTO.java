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
package com.alexdsweet.taskmanagement.dto;

import java.time.LocalDate;
import java.time.LocalDateTime;

import com.alexdsweet.taskmanagement.enums.TaskPriority;
import com.alexdsweet.taskmanagement.enums.TaskStatus;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class TaskResponseDTO {

	private Long id;

	private String title;

	private String description;

	private TaskStatus status;

	private TaskPriority priority;

	private LocalDateTime createdAt;

	private LocalDateTime updatedAt;

	private LocalDate dueDate;

	private LocalDateTime completedAt;
}