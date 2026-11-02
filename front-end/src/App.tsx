import { useCallback, useEffect, useState } from 'react'
import Sidebar from './components/layout/Sidebar'
import Header from './components/layout/Header'
import TaskStats from './components/tasks/TaskStats'
import TaskToolbar from './components/tasks/TaskToolbar'
import TaskList from './components/tasks/TaskList'
import CreateTaskModal from './components/tasks/CreateTaskModal'
import DeleteTaskModal from './components/tasks/DeleteTaskModal'
import Toast, { type ToastType } from './components/common/Toast'
import { taskApi } from './services/taskApi'
import type { Task, TaskFilter, TaskStatus, TaskStatistics } from './types/task'

function getErrorMessage(error: unknown) {
  if (error instanceof TypeError) {
    return 'Unable to connect to the server. Please check your connection.'
  }

  return 'Something went wrong. Please try again.'
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
  const [showCreateForm, setShowCreateForm] = useState(false)
  const [editingTask, setEditingTask] = useState<Task | null>(null)
  const [deleteTarget, setDeleteTarget] = useState<Task | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  const [statistics, setStatistics] = useState<TaskStatistics>({
    totalTasks: 0,
    todoTasks: 0,
    inProgressTasks: 0,
    doneTasks: 0,
  })

  const [toast, setToast] = useState<{
    message: string
    type: ToastType
  } | null>(null)

  // Debounce search to avoid sending an API request on every keystroke.
  // The API request is triggered only after the user stops typing for 500ms.
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setDebouncedSearch(search)
      setCurrentPage(0)
    }, 500)

    return () => clearTimeout(timeoutId)
  }, [search])

  const loadTasks = useCallback(async (showLoading = true) => {
    if (showLoading) {
      setLoading(true)
    }

    setError('')

    try {
      const data = await taskApi.getAll({
        page: currentPage,
        size: pageSize,
        sortBy,
        direction,
        keyword: debouncedSearch,
        status: statusFilter,
      })

      setTasks(data.content)
      setTotalPages(data.totalPages)
      setTotalElements(data.totalElements)
    } catch (err) {
      setError(getErrorMessage(err))
    } finally {
      if (showLoading) {
        setLoading(false)
      }
    }
  }, [currentPage, pageSize, sortBy, direction, debouncedSearch, statusFilter])

  useEffect(() => {
    void loadTasks()
    void loadStatistics()
  }, [loadTasks])

  async function createTask(
    title: string,
    description: string,
    status: TaskStatus
  ) {
    setSaving(true)
    setError('')

    try {
      await taskApi.create({
        title,
        description,
        status,
      })

      setCurrentPage(0)
      setStatusFilter('ALL')
      setSearch('')
      setShowCreateForm(false)

      // Reload tasks with the default filters after creation
      const data = await taskApi.getAll({
        page: 0,
        size: pageSize,
        sortBy,
        direction,
        keyword: '',
        status: 'ALL',
      })

      setTasks(data.content)
      setTotalPages(data.totalPages)
      setTotalElements(data.totalElements)

      // Reload statistics after creation
      await loadStatistics()

      // Show success notification
      showToast('Task created successfully!', 'success')
    } catch (err) {
      const message = getErrorMessage(err)
      setError(message)

      // Show error notification
      showToast(message, 'error')
    } finally {
      setSaving(false)
    }
  }

  async function updateTask(
    id: number,
    title: string,
    description: string,
    status: TaskStatus
  ) {
    const currentTask = tasks.find((task) => task.id === id)

    if (!currentTask) return

    setSaving(true)
    setError('')

    try {
      await taskApi.update({
        ...currentTask,
        title,
        description,
        status,
      })

      // Refresh tasks after updating
      await loadTasks(false)

      // Refresh statistics after updating
      await loadStatistics()

      setEditingTask(null)

      // Show success notification
      showToast('Task updated successfully!', 'success')
    } catch (err) {
      const message = getErrorMessage(err)
      setError(message)

      // Show error notification
      showToast(message, 'error')
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

      // Refresh tasks in the background to apply the updated status filter
      await loadTasks(false)

      // Reload statistics after status update
      await loadStatistics()

      // Show success notification
      showToast('Updated status successfully!', 'success')
    } catch (err) {
      const message = getErrorMessage(err)
      setError(message)

      // Show error notification
      showToast(message, 'error')
    }
  }

  async function deleteTask() {
    if (!deleteTarget) return

    setSaving(true)
    setError('')

    try {
      await taskApi.delete(deleteTarget.id)

      // Move to the previous page if the current page becomes empty
      const targetPage =
        tasks.length === 1 && currentPage > 0
          ? currentPage - 1
          : currentPage

      // Reload tasks while preserving the current filters
      const data = await taskApi.getAll({
        page: targetPage,
        size: pageSize,
        sortBy,
        direction,
        keyword: search,
        status: statusFilter,
      })

      setCurrentPage(targetPage)
      setTasks(data.content)
      setTotalPages(data.totalPages)
      setTotalElements(data.totalElements)
      setDeleteTarget(null)

      // Reload statistics after deletion
      await loadStatistics()

      // Show success notification
      showToast('Task deleted successfully!', 'success')
    } catch (err) {
      const message = getErrorMessage(err)
      setError(message)

      // Show error notification
      showToast(message, 'error')
    } finally {
      setSaving(false)
    }
  }

  async function loadStatistics() {
    try {
      const data = await taskApi.getStatistics()
      setStatistics(data)
    } catch (err) {
      setError(getErrorMessage(err))
    }
  }

  function showToast(message: string, type: ToastType) {
    setToast({ message, type })
  }

  return (
    <div className="min-h-screen bg-[#F7F5F0] text-[#342B20]">
      <div className="flex min-h-screen">
        <Sidebar
          activeFilter={statusFilter}
          onFilterChange={(filter) => {
            setStatusFilter(filter)
            setCurrentPage(0)
          }}
          total={statistics.totalTasks}
          completed={statistics.doneTasks}
        />

        <main className="min-w-0 flex-1">
          <Header />

          <div className="mx-auto max-w-7xl px-4 py-7 sm:px-8 sm:py-9 lg:px-10">
            <div className="mb-8 flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
              <div>
                <p className="mb-2 text-xs font-bold tracking-[0.18em] text-[#A9803C]">
                  OVERVIEW
                </p>
                <h2 className="text-3xl font-bold tracking-tight text-[#49351B]">
                  My Tasks
                </h2>
                <p className="mt-2 text-sm text-[#938773]">
                  Organize your work and track your progress.
                </p>
              </div>

              <button
                onClick={() => setShowCreateForm(true)}
                className="inline-flex items-center justify-center gap-2 self-start rounded-xl bg-gradient-to-r from-[#A9803C] to-[#89632F] px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-[#C8B184]/30 transition hover:-translate-y-0.5 hover:from-[#967032] hover:to-[#765225] sm:self-auto"
              >
                <span className="text-lg leading-none">+</span> Create Task
              </button>
            </div>

            {error && (
              <div
                role="alert"
                className="mb-5 flex flex-col gap-3 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800 sm:flex-row sm:items-center sm:justify-between"
              >
                <span className="break-words">{error}</span>
                <button
                  onClick={() => void loadTasks()}
                  className="shrink-0 self-start font-semibold underline sm:self-auto"
                >
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
                onSearchChange={(value) => {
                  setSearch(value)
                  setCurrentPage(0)
                }}
                statusFilter={statusFilter}
                onStatusFilterChange={(value) => {
                  setStatusFilter(value)
                  setCurrentPage(0)
                }}
                resultCount={totalElements}
                sortBy={sortBy}
                onSortByChange={(value) => {
                  setSortBy(value)
                  setCurrentPage(0)
                }}
                direction={direction}
                onDirectionChange={(value) => {
                  setDirection(value)
                  setCurrentPage(0)
                }}
              />

              {loading ? (
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
                  />

                  {/* Pagination */}
                  <div className="flex flex-col gap-4 border-t border-[#E9E1D3] px-6 py-4 sm:flex-row sm:items-center sm:justify-between">
                    {/* Total tasks and page size */}
                    <div className="flex items-center gap-3 text-sm text-[#938773]">
                      <span>
                        Showing {totalElements === 0 ? 0 : currentPage * pageSize + 1}
                        {' - '}
                        {Math.min((currentPage + 1) * pageSize, totalElements)}
                        {' of '}
                        {totalElements} tasks
                      </span>

                      <select
                        value={pageSize}
                        onChange={(e) => {
                          setPageSize(Number(e.target.value))
                          setCurrentPage(0)
                        }}
                        className="rounded-lg border border-[#E9E1D3] bg-white px-2 py-1.5 text-sm outline-none"
                      >
                        <option value={5}>5 / page</option>
                        <option value={10}>10 / page</option>
                        <option value={20}>20 / page</option>
                        <option value={50}>50 / page</option>
                      </select>
                    </div>

                    {/* Page navigation */}
                    <div className="flex items-center gap-2">
                      <button
                        disabled={currentPage === 0 || loading}
                        onClick={() => setCurrentPage((prev) => prev - 1)}
                        className="rounded-lg border border-[#E9E1D3] px-3 py-2 text-sm transition hover:bg-[#F7F5F0] disabled:cursor-not-allowed disabled:opacity-40"
                      >
                        Previous
                      </button>

                      <span className="px-3 text-sm font-medium text-[#49351B]">
                        Page {totalPages === 0 ? 0 : currentPage + 1} / {totalPages}
                      </span>

                      <button
                        disabled={currentPage >= totalPages - 1 || loading || totalPages === 0}
                        onClick={() => setCurrentPage((prev) => prev + 1)}
                        className="rounded-lg border border-[#E9E1D3] px-3 py-2 text-sm transition hover:bg-[#F7F5F0] disabled:cursor-not-allowed disabled:opacity-40"
                      >
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

      {/* Toast Notification */}
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}

      {/* Create / Edit Modal */}
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

      {/* Delete Modal */}
      {deleteTarget && (
        <DeleteTaskModal
          task={deleteTarget}
          onCancel={() => setDeleteTarget(null)}
          onConfirm={() => void deleteTask()}
          saving={saving}
        />
      )}
    </div>
  )
}