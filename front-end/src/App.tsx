import { useCallback, useEffect, useMemo, useState } from 'react'
import Sidebar from './components/layout/Sidebar'
import Header from './components/layout/Header'
import TaskStats from './components/tasks/TaskStats'
import TaskToolbar from './components/tasks/TaskToolbar'
import TaskList from './components/tasks/TaskList'
import CreateTaskModal from './components/tasks/CreateTaskModal'
import DeleteTaskModal from './components/tasks/DeleteTaskModal'
import { taskApi } from './services/taskApi'
import type { Task, TaskFilter, TaskStatus } from './types/task'

function getErrorMessage(error: unknown) {
  if (error instanceof TypeError) {
    return 'Không kết nối được backend. Hãy kiểm tra Spring Boot đang chạy và URL API trong file .env.'
  }
  return error instanceof Error ? error.message : 'Đã xảy ra lỗi không xác định.'
}

export default function App() {
  const [tasks, setTasks] = useState<Task[]>([])
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState<TaskFilter>('ALL')
  const [showCreateForm, setShowCreateForm] = useState(false)
  const [deleteTarget, setDeleteTarget] = useState<Task | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  const loadTasks = useCallback(async () => {
    setLoading(true)
    setError('')
    try {
      const data = await taskApi.getAll()
      setTasks(Array.isArray(data) ? data : [])
    } catch (err) {
      setError(getErrorMessage(err))
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { void loadTasks() }, [loadTasks])

  const stats = useMemo(() => ({
    total: tasks.length,
    todo: tasks.filter((task) => task.status === 'TODO').length,
    inProgress: tasks.filter((task) => task.status === 'IN_PROGRESS').length,
    done: tasks.filter((task) => task.status === 'DONE').length,
  }), [tasks])

  const filteredTasks = useMemo(() => {
    const query = search.trim().toLowerCase()
    return tasks.filter((task) => {
      const matchesSearch = task.title.toLowerCase().includes(query) ||
        (task.description || '').toLowerCase().includes(query)
      const matchesStatus = statusFilter === 'ALL' || task.status === statusFilter
      return matchesSearch && matchesStatus
    })
  }, [tasks, search, statusFilter])

  async function createTask(title: string, description: string, status: TaskStatus) {
    setSaving(true)
    setError('')
    try {
      const created = await taskApi.create({ title, description, status })
      setTasks((current) => [created, ...current.filter((task) => task.id !== created.id)])
      setStatusFilter('ALL')
      setSearch('')
      setShowCreateForm(false)
    } catch (err) {
      setError(getErrorMessage(err))
    } finally {
      setSaving(false)
    }
  }

  async function deleteTask() {
    if (!deleteTarget) return
    setSaving(true)
    setError('')
    try {
      await taskApi.delete(deleteTarget.id)
      setTasks((current) => current.filter((task) => task.id !== deleteTarget.id))
      setDeleteTarget(null)
    } catch (err) {
      setError(getErrorMessage(err))
    } finally {
      setSaving(false)
    }
  }

  async function updateTaskStatus(id: number, status: TaskStatus) {
    const currentTask = tasks.find((task) => task.id === id)
    if (!currentTask || currentTask.status === status) return
    setError('')
    try {
      const updated = await taskApi.updateStatus(currentTask, status)
      setTasks((current) => current.map((task) => task.id === id ? { ...task, ...updated } : task))
    } catch (err) {
      setError(getErrorMessage(err))
    }
  }

  return (
    <div className="min-h-screen bg-[#F7F5F0] text-[#342B20]">
      <div className="flex min-h-screen">
        <Sidebar activeFilter={statusFilter} onFilterChange={setStatusFilter} total={stats.total} completed={stats.done} />
        <main className="min-w-0 flex-1">
          <Header />
          <div className="mx-auto max-w-7xl px-4 py-7 sm:px-8 sm:py-9 lg:px-10">
            <div className="mb-8 flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
              <div>
                <p className="mb-2 text-xs font-bold tracking-[0.18em] text-[#A9803C]">OVERVIEW</p>
                <h2 className="text-3xl font-bold tracking-tight text-[#49351B]">My Tasks</h2>
                <p className="mt-2 text-sm text-[#938773]">Organize your work and track your progress.</p>
              </div>
              <button onClick={() => setShowCreateForm(true)} className="inline-flex items-center justify-center gap-2 self-start rounded-xl bg-gradient-to-r from-[#A9803C] to-[#89632F] px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-[#C8B184]/30 transition hover:-translate-y-0.5 hover:from-[#967032] hover:to-[#765225] sm:self-auto">
                <span className="text-lg leading-none">+</span> Create Task
              </button>
            </div>

            {error && <div role="alert" className="mb-5 flex flex-col gap-3 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800 sm:flex-row sm:items-center sm:justify-between">
              <span className="break-words">{error}</span>
              <button onClick={() => void loadTasks()} className="shrink-0 self-start font-semibold underline sm:self-auto">Retry</button>
            </div>}

            <TaskStats total={stats.total} todo={stats.todo} inProgress={stats.inProgress} done={stats.done} />
            <section className="overflow-hidden rounded-2xl border border-[#E9E1D3] bg-white shadow-sm shadow-[#8C7349]/5">
              <TaskToolbar search={search} onSearchChange={setSearch} statusFilter={statusFilter} onStatusFilterChange={setStatusFilter} resultCount={filteredTasks.length} />
              {loading ? <div className="px-6 py-16 text-center text-sm text-[#938773]">Loading tasks from database...</div> :
                <TaskList tasks={filteredTasks} totalTasks={tasks.length} onStatusChange={updateTaskStatus} onDelete={setDeleteTarget} onCreateTask={() => setShowCreateForm(true)} />}
            </section>
            <footer className="py-6 text-center text-xs text-[#A19683]">Built with React, TypeScript, Tailwind CSS and Spring Boot</footer>
          </div>
        </main>
      </div>

      {showCreateForm && <CreateTaskModal onClose={() => setShowCreateForm(false)} onCreate={createTask} saving={saving} />}
      {deleteTarget && <DeleteTaskModal task={deleteTarget} onCancel={() => setDeleteTarget(null)} onConfirm={() => void deleteTask()} saving={saving} />}
    </div>
  )
}
