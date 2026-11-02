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

public class TaskStatisticsDTO {

	private long mTotalTasks;
	private long mTodoTasks;
	private long mInProgressTasks;
	private long mDoneTasks;

	public TaskStatisticsDTO(long inTotalTasks, long inTodoTasks, long inInProgressTasks, long inDoneTasks) {
		mTotalTasks = inTotalTasks;
		mTodoTasks = inTodoTasks;
		mInProgressTasks = inInProgressTasks;
		mDoneTasks = inDoneTasks;
	}

	public long getTotalTasks() {
		return mTotalTasks;
	}

	public long getTodoTasks() {
		return mTodoTasks;
	}

	public long getInProgressTasks() {
		return mInProgressTasks;
	}

	public long getDoneTasks() {
		return mDoneTasks;
	}
}