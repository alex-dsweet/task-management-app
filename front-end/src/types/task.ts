export type TaskStatus = 'TODO' | 'IN_PROGRESS' | 'DONE'

export type Task = {
  id: number
  title: string
  description: string | null
  status: TaskStatus
  createdAt: string
  updatedAt?: string | null
}

export interface PageResponse<T> {
  content: T[]
  totalElements: number
  totalPages: number
  size: number
  number: number
  first: boolean
  last: boolean
  empty: boolean
}

export interface TaskPageParams {
  page: number
  size: number
  sortBy: string
  direction: 'asc' | 'desc'
  keyword: string
  status: TaskFilter
}

export interface TaskStatistics {
  totalTasks: number
  todoTasks: number
  inProgressTasks: number
  doneTasks: number
}

export type TaskFilter = 'ALL' | TaskStatus
