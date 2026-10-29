export type TaskStatus = 'TODO' | 'IN_PROGRESS' | 'DONE'

export type Task = {
  id: number
  title: string
  description: string | null
  status: TaskStatus
  createdAt: string
  updatedAt?: string | null
}

export type TaskFilter = 'ALL' | TaskStatus
