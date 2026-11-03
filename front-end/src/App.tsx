import { useCallback, useEffect, useRef, useState } from 'react'
import Sidebar from './components/layout/Sidebar'
import Header from './components/layout/Header'
import TaskStats from './components/tasks/TaskStats'
import TaskToolbar from './components/tasks/TaskToolbar'
import TaskList from './components/tasks/TaskList'
import CreateTaskModal from './components/tasks/CreateTaskModal'
import DeleteTaskModal from './components/tasks/DeleteTaskModal'
import TaskDetailModal from './components/tasks/TaskDetailModal'
import Toast, { type ToastType } from './components/common/Toast'
import { taskApi } from './services/taskApi'
import type {
  Task, TaskFilter, TaskStatus, TaskPriority,
  TaskStatistics, PriorityFilter,
} from './types/task'

function getErrorMessage(error: unknown) {
  return error instanceof TypeError
    ? 'Unable to connect to the server. Please check your connection.'
    : 'Something went wrong. Please try again.'
}

export default function App() {
  const [tasks, setTasks] = useState<Task[]>([])
  const [currentPage, setCurrentPage] = useState(0)
  const [pageSize, setPageSize] = useState(5)
  const [totalPages, setTotalPages] = useState(0)
  const [totalElements, setTotalElements] = useState(0)
  const [sortBy, setSortBy] = useState('createdAt')
  const [direction, setDirection] = useState<'asc' | 'desc'>('desc')
  const [search, setSearch] = useState('')
  const [debouncedSearch, setDebouncedSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState<TaskFilter>('ALL')
  const [priorityFilter, setPriorityFilter] = useState<PriorityFilter>('ALL')

  const [showCreateForm, setShowCreateForm] = useState(false)
  const [editingTask, setEditingTask] = useState<Task | null>(null)
  const [deleteTarget, setDeleteTarget] = useState<Task | null>(null)
  const [viewingTask, setViewingTask] = useState<Task | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [toast, setToast] = useState<{ message: string; type: ToastType } | null>(null)

  const requestId = useRef(0)

  const [statistics, setStatistics] = useState<TaskStatistics>({
    totalTasks: 0,
    todoTasks: 0,
    inProgressTasks: 0,
    doneTasks: 0,
  })

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search)
      setCurrentPage(0)
    }, 500)
    return () => clearTimeout(timer)
  }, [search])

  function showToast(message: string, type: ToastType) {
    setToast({ message, type })
  }

  function handleError(err: unknown) {
    const message = getErrorMessage(err)
    setError(message)
    showToast(message, 'error')
  }

  const loadStatistics = useCallback(async () => {
    try {
      setStatistics(await taskApi.getStatistics())
    } catch (err) {
      setError(getErrorMessage(err))
    }
  }, [])

  const loadTasks = useCallback(async (
    overrides: Partial<Parameters<typeof taskApi.getAll>[0]> = {}
  ) => {
    const id = ++requestId.current
    setLoading(true)
    setError('')

    try {
      const data = await taskApi.getAll({
        page: currentPage,
        size: pageSize,
        sortBy,
        direction,
        keyword: debouncedSearch,
        status: statusFilter,
        priority: priorityFilter,
        ...overrides,
      })

      if (id !== requestId.current) return

      setTasks(data.content)
      setTotalPages(data.totalPages)
      setTotalElements(data.totalElements)
    } catch (err) {
      if (id === requestId.current) {
        setError(getErrorMessage(err))
      }
    } finally {
      if (id === requestId.current) {
        setLoading(false)
      }
    }
  }, [currentPage, pageSize, sortBy, direction, debouncedSearch, statusFilter, priorityFilter])

  useEffect(() => {
    void loadTasks()
    return () => {
      requestId.current++
    }
  }, [loadTasks])

  useEffect(() => {
    void loadStatistics()
  }, [loadStatistics])

  async function refreshData(
    overrides?: Partial<Parameters<typeof taskApi.getAll>[0]>
  ) {
    await Promise.all([
      loadTasks(overrides),
      loadStatistics(),
    ])
  }

  async function createTask(
    title: string, description: string, status: TaskStatus,
    priority: TaskPriority, dueDate: string | null
  ) {
    setSaving(true)
    setError('')

    try {
      await taskApi.create({ title, description, status, priority, dueDate })
      setCurrentPage(0)
      setStatusFilter('ALL')
      setPriorityFilter('ALL')
      setSearch('')
      setDebouncedSearch('')
      setShowCreateForm(false)

      showToast('Task created successfully!', 'success')
      await refreshData({
        page: 0,
        keyword: '',
        status: 'ALL',
        priority: 'ALL',
      })
    } catch (err) {
      handleError(err)
    } finally {
      setSaving(false)
    }
  }

  async function updateTask(
    id: number, title: string, description: string,
    status: TaskStatus, priority: TaskPriority, dueDate: string | null
  ) {
    const currentTask = tasks.find((task) => task.id === id)
    if (!currentTask) return

    setSaving(true)
    setError('')

    try {
      await taskApi.update({
        ...currentTask, title, description, status, priority, dueDate,
      })

      setEditingTask(null)
      showToast('Task updated successfully!', 'success')
      await refreshData()
    } catch (err) {
      handleError(err)
    } finally {
      setSaving(false)
    }
  }

  async function updateTaskStatus(id: number, status: TaskStatus) {
    const currentTask = tasks.find((task) => task.id === id)
    if (!currentTask || currentTask.status === status) return

    setError('')

    try {
      await taskApi.updateStatus(currentTask, status)
      showToast('Updated status successfully!', 'success')
      await refreshData()
    } catch (err) {
      handleError(err)
    }
  }

  async function deleteTask() {
    if (!deleteTarget) return

    setSaving(true)
    setError('')

    try {
      await taskApi.delete(deleteTarget.id)

      const targetPage = tasks.length === 1 && currentPage > 0
        ? currentPage - 1 : currentPage

      setCurrentPage(targetPage)
      setDeleteTarget(null)
      showToast('Task deleted successfully!', 'success')
      await refreshData({ page: targetPage })
    } catch (err) {
      handleError(err)
    } finally {
      setSaving(false)
    }
  }

  function editTaskFromDetail(task: Task) {
    setViewingTask(null)
    setEditingTask(task)
  }

  function resetPage<T>(setter: (value: T) => void, value: T) {
    setter(value)
    setCurrentPage(0)
  }

  return (
    <div className="min-h-screen bg-[#F7F5F0] text-[#342B20]">
      <div className="flex min-h-screen">
        <Sidebar
          activeFilter={statusFilter}
          onFilterChange={(value) => resetPage(setStatusFilter, value)}
          total={statistics.totalTasks}
          completed={statistics.doneTasks}
        />

        <main className="min-w-0 flex-1">
          <Header />

          <div className="mx-auto max-w-7xl px-4 py-7 sm:px-8 sm:py-9 lg:px-10">
            <div className="mb-8 flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
              <div>
                <p className="mb-2 text-xs font-bold tracking-[0.18em] text-[#A9803C]">OVERVIEW</p>
                <h2 className="text-3xl font-bold tracking-tight text-[#49351B]">My Tasks</h2>
                <p className="mt-2 text-sm text-[#938773]">
                  Organize your work and track your progress.
                </p>
              </div>
            </div>

            {error && (
              <div role="alert"
                className="mb-5 flex flex-col gap-3 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800 sm:flex-row sm:items-center sm:justify-between">
                <span className="break-words">{error}</span>
                <button onClick={() => void loadTasks()}
                  className="shrink-0 self-start font-semibold underline sm:self-auto">
                  Retry
                </button>
              </div>
            )}

            <TaskStats
              total={statistics.totalTasks}
              todo={statistics.todoTasks}
              inProgress={statistics.inProgressTasks}
              done={statistics.doneTasks}
            />

            <section className="overflow-hidden rounded-2xl border border-[#E9E1D3] bg-white shadow-sm shadow-[#8C7349]/5">
              <TaskToolbar
                search={search}
                onSearchChange={(value) => resetPage(setSearch, value)}
                statusFilter={statusFilter}
                onStatusFilterChange={(value) => resetPage(setStatusFilter, value)}
                priorityFilter={priorityFilter}
                onPriorityFilterChange={(value) => resetPage(setPriorityFilter, value)}
                resultCount={totalElements}
                sortBy={sortBy}
                onSortByChange={(value) => resetPage(setSortBy, value)}
                direction={direction}
                onDirectionChange={(value) => resetPage(setDirection, value)}
                onCreateTask={() => setShowCreateForm(true)}
              />

              {loading && tasks.length === 0 ? (
                <div className="px-6 py-16 text-center text-sm text-[#938773]">
                  Loading tasks from database...
                </div>
              ) : (
                <>
                  <TaskList
                    tasks={tasks}
                    totalTasks={totalElements}
                    onStatusChange={updateTaskStatus}
                    onEdit={setEditingTask}
                    onDelete={setDeleteTarget}
                    onCreateTask={() => setShowCreateForm(true)}
                    onView={setViewingTask}
                  />

                  <div className="flex flex-col gap-4 border-t border-[#E9E1D3] px-6 py-4 sm:flex-row sm:items-center sm:justify-between">
                    <div className="flex items-center gap-3 text-sm text-[#938773]">
                      <span>
                        Showing {totalElements === 0 ? 0 : currentPage * pageSize + 1}
                        {' - '}
                        {Math.min((currentPage + 1) * pageSize, totalElements)}
                        {' of '}
                        {totalElements} tasks
                      </span>

                      <select value={pageSize}
                        onChange={(e) => resetPage(setPageSize, Number(e.target.value))}
                        className="rounded-lg border border-[#E9E1D3] bg-white px-2 py-1.5 text-sm outline-none">
                        {[5, 10, 20, 50].map((size) => (
                          <option key={size} value={size}>{size} / page</option>
                        ))}
                      </select>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        disabled={currentPage === 0 || loading}
                        onClick={() => setCurrentPage((prev) => prev - 1)}
                        className="rounded-lg border border-[#E9E1D3] px-3 py-2 text-sm transition hover:bg-[#F7F5F0] disabled:cursor-not-allowed disabled:opacity-40">
                        Previous
                      </button>

                      <span className="px-3 text-sm font-medium text-[#49351B]">
                        Page {totalPages === 0 ? 0 : currentPage + 1} / {totalPages}
                      </span>

                      <button
                        disabled={currentPage >= totalPages - 1 || loading || totalPages === 0}
                        onClick={() => setCurrentPage((prev) => prev + 1)}
                        className="rounded-lg border border-[#E9E1D3] px-3 py-2 text-sm transition hover:bg-[#F7F5F0] disabled:cursor-not-allowed disabled:opacity-40">
                        Next
                      </button>
                    </div>
                  </div>
                </>
              )}
            </section>

            <footer className="py-6 text-center text-xs text-[#A19683]">
              Built with Spring Boot, React, TypeScript and Tailwind CSS by{' '}
              <b>alex.dsweet</b> 💗
            </footer>
          </div>
        </main>
      </div>

      {toast && (
        <Toast message={toast.message} type={toast.type}
          onClose={() => setToast(null)} />
      )}

      {(showCreateForm || editingTask) && (
        <CreateTaskModal
          key={editingTask?.id ?? 'create'}
          task={editingTask}
          onClose={() => {
            setShowCreateForm(false)
            setEditingTask(null)
          }}
          onCreate={createTask}
          onUpdate={updateTask}
          saving={saving}
        />
      )}

      {deleteTarget && (
        <DeleteTaskModal
          task={deleteTarget}
          onCancel={() => setDeleteTarget(null)}
          onConfirm={() => void deleteTask()}
          saving={saving}
        />
      )}

      {viewingTask && (
        <TaskDetailModal
          task={viewingTask}
          onClose={() => setViewingTask(null)}
          onEdit={editTaskFromDetail}
        />
      )}
    </div>
  )
}