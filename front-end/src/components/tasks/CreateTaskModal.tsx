import { useState, type FormEvent } from 'react'
import type { Task, TaskStatus, TaskPriority } from '../../types/task'
import { statusConfig } from '../ui/statusConfig'

type TaskFormValues = [
  title: string,
  description: string,
  status: TaskStatus,
  priority: TaskPriority,
  dueDate: string | null,
]

type CreateTaskModalProps = {
  task?: Task | null
  onClose: () => void
  onCreate: (...values: TaskFormValues) => Promise<void>
  onUpdate: (id: number, ...values: TaskFormValues) => Promise<void>
  saving: boolean
}

const priorityStyles: Record<TaskPriority, string> = {
  LOW: 'border-slate-200 bg-slate-50 text-slate-600',
  MEDIUM: 'border-amber-200 bg-amber-50 text-amber-700',
  HIGH: 'border-rose-200 bg-rose-50 text-rose-700',
}

export default function CreateTaskModal({
  task = null, onClose, onCreate, onUpdate, saving,
}: CreateTaskModalProps) {
  const [title, setTitle] = useState(task?.title ?? '')
  const [description, setDescription] = useState(task?.description ?? '')
  const [status, setStatus] = useState<TaskStatus>(task?.status ?? 'TODO')
  const [priority, setPriority] = useState<TaskPriority>(task?.priority ?? 'MEDIUM')
  const [dueDate, setDueDate] = useState(task?.dueDate ?? '')
  const [error, setError] = useState('')

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (saving) return

    if (!title.trim()) {
      setError('Task title is required.')
      return
    }

    const values: TaskFormValues = [
      title.trim(),
      description.trim(),
      status,
      priority,
      dueDate || null,
    ]

    if (task) {
      void onUpdate(task.id, ...values)
    } else {
      void onCreate(...values)
    }
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-[#302516]/50 p-4 backdrop-blur-sm"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget && !saving) onClose()
      }}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="create-task-title"
        className="my-auto w-full max-w-xl overflow-hidden rounded-3xl border border-[#E9E1D3] bg-white shadow-2xl"
      >
        <div className="flex items-start justify-between bg-gradient-to-r from-[#FFF2D5] via-[#FFFAF0] to-white px-6 py-6 sm:px-8">
          <div>
            <p className="mb-2 text-xs font-bold uppercase tracking-[0.18em] text-[#B68B45]">
              {task ? 'Task Management / Edit' : 'Task Management / New'}
            </p>
            <h3 id="create-task-title" className="text-2xl font-bold tracking-tight text-[#49351B]">
              {task ? 'Edit Task' : 'Create New Task'}
            </h3>
            <p className="mt-2 text-sm text-[#938773]">
              {task
                ? 'Make changes to your task information.'
                : 'Plan your work and stay on top of your goals.'}
            </p>
          </div>

          <button type="button" onClick={onClose} disabled={saving}
            aria-label="Close dialog"
            className="ml-3 cursor-pointer rounded-xl bg-white/80 px-3 py-2 text-lg text-[#938773] transition hover:bg-[#F3E7CF] hover:text-[#49351B] disabled:opacity-50">
            ×
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="max-h-[65vh] space-y-5 overflow-y-auto px-6 py-6 sm:px-8">
            <div>
              <div className="mb-2 flex items-center justify-between">
                <label htmlFor="task-title" className="text-sm font-bold text-[#5D4A30]">
                  Task Title <span className="text-rose-500">*</span>
                </label>
                <span className="text-xs text-[#B5AA98]">{title.length}/100</span>
              </div>

              <input
                id="task-title"
                autoFocus
                value={title}
                onChange={(event) => {
                  setTitle(event.target.value)
                  setError('')
                }}
                maxLength={100}
                placeholder="e.g. Implement user authentication"
                className="w-full rounded-xl border border-[#E8E0D1] bg-[#FFFEFC] px-4 py-3.5 text-sm text-[#49351B] outline-none transition placeholder:text-[#B5AA98] focus:border-[#B68B45] focus:ring-4 focus:ring-[#F8F0DE]"
              />

              {error && (
                <p className="mt-2 text-xs font-medium text-rose-600">{error}</p>
              )}
            </div>

            <div>
              <div className="mb-2 flex items-center justify-between">
                <label htmlFor="task-description" className="text-sm font-bold text-[#5D4A30]">
                  Description
                </label>
                <span className="text-xs text-[#B5AA98]">{description.length}/500</span>
              </div>

              <textarea
                id="task-description"
                value={description}
                onChange={(event) => setDescription(event.target.value)}
                rows={3}
                maxLength={500}
                placeholder="Describe what needs to be done..."
                className="w-full resize-y rounded-xl border border-[#E8E0D1] bg-[#FFFEFC] px-4 py-3.5 text-sm leading-6 text-[#49351B] outline-none transition placeholder:text-[#B5AA98] focus:border-[#B68B45] focus:ring-4 focus:ring-[#F8F0DE]"
              />
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label htmlFor="task-status" className="mb-2 block text-sm font-bold text-[#5D4A30]">
                  Status
                </label>
                <select
                  id="task-status"
                  value={status}
                  onChange={(event) => setStatus(event.target.value as TaskStatus)}
                  className={`w-full cursor-pointer rounded-xl border px-4 py-3.5 text-sm font-semibold outline-none transition focus:ring-4 ${statusConfig[status].selectClass}`}
                >
                  <option value="TODO">To Do</option>
                  <option value="IN_PROGRESS">In Progress</option>
                  <option value="DONE">Completed</option>
                </select>
              </div>

              <div>
                <label htmlFor="task-priority" className="mb-2 block text-sm font-bold text-[#5D4A30]">
                  Priority
                </label>
                <select
                  id="task-priority"
                  value={priority}
                  onChange={(event) => setPriority(event.target.value as TaskPriority)}
                  className={`w-full cursor-pointer rounded-xl border px-4 py-3.5 text-sm font-semibold outline-none transition focus:ring-4 focus:ring-[#F8F0DE] ${priorityStyles[priority]}`}
                >
                  <option value="LOW">Low Priority</option>
                  <option value="MEDIUM">Medium Priority</option>
                  <option value="HIGH">High Priority</option>
                </select>
              </div>
            </div>

            <div className="rounded-2xl border border-[#F0E3C8] bg-[#FFFBF2] p-4">
              <div className="mb-3 flex items-center justify-between">
                <label htmlFor="task-due-date" className="text-sm font-bold text-[#89632F]">
                  Due Date
                </label>
                <span className="rounded-full bg-white px-2.5 py-1 text-[10px] font-semibold text-[#A19683]">
                  OPTIONAL
                </span>
              </div>

              <div className="flex items-center gap-2">
                <input
                  id="task-due-date"
                  type="date"
                  value={dueDate}
                  onChange={(event) => setDueDate(event.target.value)}
                  onClick={(event) => event.currentTarget.showPicker?.()}
                  className="min-w-0 flex-1 cursor-pointer rounded-xl border border-[#E8D8B7] bg-white px-4 py-3 text-sm font-medium text-[#746650] outline-none transition focus:border-[#B68B45] focus:ring-4 focus:ring-[#F8F0DE]"
                />

                {dueDate && (
                  <button type="button" onClick={() => setDueDate('')}
                    className="cursor-pointer rounded-xl border border-[#E8D8B7] bg-white px-4 py-3 text-sm font-semibold text-[#938773] transition hover:bg-[#FFF3DE]">
                    Clear
                  </button>
                )}
              </div>

              <p className="mt-3 text-xs text-[#A19683]">
                Set a deadline to keep your task on schedule.
              </p>
            </div>
          </div>

          <div className="flex flex-col-reverse gap-3 border-t border-[#F0EBDD] bg-[#FCFAF5] px-6 py-5 sm:flex-row sm:justify-end sm:px-8">
            <button type="button" onClick={onClose} disabled={saving}
              className="cursor-pointer rounded-xl border border-[#E8E0D1] bg-white px-5 py-3 text-sm font-semibold text-[#746650] transition hover:bg-[#F7F3EA] disabled:opacity-50">
              Cancel
            </button>

            <button type="submit" disabled={saving}
              className="cursor-pointer rounded-xl bg-gradient-to-r from-[#A9803C] to-[#89632F] px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-[#C8B184]/30 transition hover:-translate-y-0.5 hover:from-[#967032] hover:to-[#765225] disabled:cursor-not-allowed disabled:opacity-60">
              {saving ? 'Saving...' : task ? 'Save Changes' : '+ Create Task'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}