export type TaskStatus = 'TODO' | 'IN_PROGRESS' | 'DONE'

export type TaskPriority = 'LOW' | 'MEDIUM' | 'HIGH'

export type Task = {
  id: number
  title: string
  description: string | null
  status: TaskStatus
  priority: TaskPriority
  createdAt: string
  updatedAt?: string | null
  dueDate: string | null
  completedAt: string | null
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
  priority: PriorityFilter
}

export interface TaskStatistics {
  totalTasks: number
  todoTasks: number
  inProgressTasks: number
  doneTasks: number
}

export type TaskFilter = 'ALL' | TaskStatus

export type PriorityFilter = 'ALL' | TaskPriority