import type {
  Task, TaskStatus, TaskPriority,
  PageResponse, TaskPageParams, TaskStatistics,
} from '../types/task'

const API_BASE_URL = (
  import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api/tasks'
).replace(/\/$/, '')

type TaskPayload = {
  title: string
  description: string
  status: TaskStatus
  priority: TaskPriority
  dueDate: string | null
}

async function request<T>(path = '', init?: RequestInit): Promise<T> {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...init,
    headers: {
      ...(init?.body ? { 'Content-Type': 'application/json' } : {}),
      ...init?.headers,
    },
  })

  if (!response.ok) {
    const body = await response.text().catch(() => '')
    let message = body

    try {
      const error = JSON.parse(body)
      message = error.message || error.error || body
    } catch {
      // Keep the original response when it is not JSON.
    }

    throw new Error(message || `API request failed (${response.status})`)
  }

  if (response.status === 204) return undefined as T

  const text = await response.text()
  return (text ? JSON.parse(text) : undefined) as T
}

export const taskApi = {
  getAll: (params: TaskPageParams) => {
    const query = new URLSearchParams({
      page: String(params.page),
      size: String(params.size),
      sortBy: params.sortBy,
      direction: params.direction,
    })

    if (params.keyword.trim()) query.set('keyword', params.keyword.trim())
    if (params.status !== 'ALL') query.set('status', params.status)
    if (params.priority !== 'ALL') query.set('priority', params.priority)

    return request<PageResponse<Task>>(`?${query}`)
  },

  getById: (id: number) => request<Task>(`/${id}`),

  create: (payload: TaskPayload) =>
    request<Task>('', {
      method: 'POST',
      body: JSON.stringify(payload),
    }),

  update: (task: Task) => {
    const { title, description, status, priority, dueDate } = task

    return request<Task>(`/${task.id}`, {
      method: 'PUT',
      body: JSON.stringify({ title, description, status, priority, dueDate }),
    })
  },

  updateStatus: (task: Task, status: TaskStatus) =>
    taskApi.update({ ...task, status }),

  delete: (id: number) =>
    request<void>(`/${id}`, { method: 'DELETE' }),

  getStatistics: () =>
    request<TaskStatistics>('/statistics'),
}