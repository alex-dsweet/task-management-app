import type { Task } from '../types/task'

export const initialTasks: Task[] = [
  {
    id: 1,
    title: 'Build REST API',
    description: 'Implement task management CRUD endpoints',
    status: 'DONE',
    createdAt: '2026-10-20',
  },
  {
    id: 2,
    title: 'Configure MySQL',
    description: 'Set up database and JPA entities',
    status: 'DONE',
    createdAt: '2026-10-21',
  },
  {
    id: 3,
    title: 'Build React dashboard',
    description: 'Create a responsive task management interface',
    status: 'IN_PROGRESS',
    createdAt: '2026-10-28',
  },
  {
    id: 4,
    title: 'Connect frontend to API',
    description: 'Integrate Axios with Spring Boot endpoints',
    status: 'TODO',
    createdAt: '2026-10-29',
  },
  {
    id: 5,
    title: 'Add input validation',
    description: 'Validate task fields and display error messages',
    status: 'TODO',
    createdAt: '2026-10-29',
  },
]
