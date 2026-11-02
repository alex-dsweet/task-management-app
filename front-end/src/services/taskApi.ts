import type {
  Task,
  TaskStatus,
  PageResponse,
  TaskPageParams,
  TaskStatistics,
} from '../types/task'

// Override this in .env if your Spring Boot API uses another host or path.
const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api/tasks').replace(/\/$/, '')

type TaskPayload = {
  title: string
  description: string
  status: TaskStatus
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
    throw new Error(body || `API request failed (${response.status} ${response.statusText})`)
  }

  if (response.status === 204) return undefined as T
  const text = await response.text()
  return (text ? JSON.parse(text) : undefined) as T
}

export const taskApi = {
  getAll: (params: TaskPageParams) => {
    const queryParams = new URLSearchParams({
      page: String(params.page),
      size: String(params.size),
      sortBy: params.sortBy,
      direction: params.direction,
    })

    if (params.keyword.trim()) {
      queryParams.set('keyword', params.keyword.trim())
    }

    if (params.status !== 'ALL') {
      queryParams.set('status', params.status)
    }

    return request<PageResponse<Task>>(`?${queryParams.toString()}`)
  },
  create: (payload: TaskPayload) =>
    request<Task>('', { method: 'POST', body: JSON.stringify(payload) }),
  update: (task: Task) =>
    request<Task>(`/${task.id}`, {
      method: 'PUT',
      body: JSON.stringify({
        title: task.title,
        description: task.description,
        status: task.status,
      }),
    }),
  updateStatus: (task: Task, status: TaskStatus) =>
    taskApi.update({ ...task, status }),
  delete: (id: number) => request<void>(`/${id}`, { method: 'DELETE' }),
  getStatistics: () => request<TaskStatistics>('/statistics'),
}