import type { Task, TaskStatus } from '../../types/task'
import PriorityBadge from '../ui/PriorityBadge'
import { statusConfig } from '../ui/statusConfig'

type TaskItemProps = {
  task: Task
  onStatusChange: (id: number, status: TaskStatus) => void
  onEdit: (task: Task) => void
  onDelete: (task: Task) => void
  onView: (task: Task) => void
}

function getTodayLocal() {
  const now = new Date()
  const year = now.getFullYear()
  const month = String(now.getMonth() + 1).padStart(2, '0')
  const day = String(now.getDate()).padStart(2, '0')

  return `${year}-${month}-${day}`
}

function formatDate(value: string | null | undefined) {
  if (!value) return '—'

  const [year, month, day] = value.slice(0, 10).split('-')
  return `${day}/${month}/${year}`
}

export default function TaskItem({
  task,
  onStatusChange,
  onEdit,
  onDelete,
  onView,
}: TaskItemProps) {
  const statusStyle = statusConfig[task.status]
  const today = getTodayLocal()

  const isCompleted = task.status === 'DONE'
  const isOverdue = !!task.dueDate && !isCompleted && task.dueDate < today
  const isDueToday = !!task.dueDate && !isCompleted && task.dueDate === today

  const deadlineStyle = isOverdue
    ? 'border-rose-200 bg-rose-50 text-rose-700'
    : isDueToday
      ? 'border-orange-200 bg-orange-50 text-orange-700'
      : isCompleted
        ? 'border-emerald-200 bg-emerald-50 text-emerald-700'
        : 'border-[#EADFCB] bg-[#FCFAF5] text-[#89632F]'

  return (
    <article
      className={`group relative grid grid-cols-1 gap-4 px-5 py-5 transition-all duration-200 lg:grid-cols-12 lg:items-center lg:gap-4 lg:px-6 ${isOverdue
          ? 'bg-[#FFF5F5] hover:bg-[#FFEBEB]'
          : 'hover:bg-[#FFFCF6]'
        }`}
    >
      {/* Hover Accent */}
      <div className="absolute inset-y-0 left-0 w-1 scale-y-0 rounded-r-full bg-gradient-to-b from-[#D6B36A] to-[#A9803C] transition-transform duration-200 group-hover:scale-y-100" />

      {/* Task Information */}
      <div className="min-w-0 lg:col-span-5">
        <div className="flex min-w-0 items-center gap-2">
          {isCompleted ? (
            <span
              title="Completed"
              aria-label="Completed"
              role="img"
              className="inline-flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-emerald-500 text-white"
            >
              <svg
                width="11" height="11" viewBox="0 0 24 24"
                fill="none" stroke="currentColor" strokeWidth="3"
                strokeLinecap="round" strokeLinejoin="round"
                aria-hidden="true"
              >
                <path d="M5 12l4 4L19 6" />
              </svg>
            </span>
          ) : (
            <PriorityBadge priority={task.priority} />
          )}

          <h4 className="min-w-0 max-w-[75%] text-sm font-bold text-[#49351B]">
            <button
              type="button"
              onClick={() => onView(task)}
              title={task.title}
              className="block max-w-full cursor-pointer truncate text-left transition-colors hover:text-[#A9803C] hover:underline focus-visible:rounded focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#B68B45]"
            >
              {task.title}
            </button>
          </h4>

          {isOverdue && (
            <span className="inline-flex shrink-0 items-center gap-1 rounded-md bg-rose-100 px-2 py-0.5 text-[10px] font-semibold text-rose-700">
              <svg
                width="11" height="11" viewBox="0 0 24 24"
                fill="none" stroke="currentColor" strokeWidth="2"
                strokeLinecap="round" strokeLinejoin="round"
                aria-hidden="true"
              >
                <circle cx="12" cy="12" r="10" />
                <path d="M12 8v4M12 16h.01" />
              </svg>
              Overdue
            </span>
          )}
        </div>

        <p
          title={task.description || ''}
          className="mt-1.5 w-[85%] truncate text-xs leading-5 text-[#A19683]"
        >
          {task.description || 'No description.'}
        </p>
      </div>

      {/* Status */}
      <div className="lg:col-span-2">
        <p className="mb-2 text-[10px] font-bold uppercase tracking-wider text-[#A19683] lg:hidden">
          Status
        </p>

        <select
          value={task.status}
          onChange={(event) =>
            onStatusChange(task.id, event.target.value as TaskStatus)
          }
          aria-label={`Status for ${task.title}`}
          className={`max-w-full cursor-pointer rounded-xl border px-3 py-2 text-xs font-semibold outline-none transition focus:ring-2 ${statusStyle.selectClass}`}
        >
          <option value="TODO">To Do</option>
          <option value="IN_PROGRESS">In Progress</option>
          <option value="DONE">Completed</option>
        </select>
      </div>

      {/* Deadline */}
      <div className="min-w-0 lg:col-span-2">
        <p className="mb-2 text-[10px] font-bold uppercase tracking-wider text-[#A19683] lg:hidden">
          Deadline
        </p>

        {task.dueDate ? (
          <div className="flex flex-col items-start gap-1.5">
            <span
              className={`inline-flex max-w-full items-center gap-1.5 rounded-lg border px-2.5 py-1.5 text-[11px] font-semibold ${deadlineStyle}`}
            >
              <svg
                width="13" height="13" viewBox="0 0 24 24"
                fill="none" stroke="currentColor" strokeWidth="1.8"
                strokeLinecap="round" strokeLinejoin="round"
                aria-hidden="true"
              >
                <rect x="3" y="5" width="18" height="16" rx="2" />
                <path d="M16 3v4M8 3v4M3 10h18" />
              </svg>
              {formatDate(task.dueDate)}
            </span>

            {isDueToday && (
              <span className="text-[10px] font-bold text-orange-600">
                Today
              </span>
            )}
          </div>
        ) : (
          <span className="text-xs italic text-[#B5AA98]">
            No deadline
          </span>
        )}
      </div>

      {/* Created Date */}
      <div className="lg:col-span-1">
        <p className="mb-2 text-[10px] font-bold uppercase tracking-wider text-[#A19683] lg:hidden">
          Created
        </p>

        <span className="text-[11px] font-medium text-[#938773]">
          {formatDate(task.createdAt)}
        </span>
      </div>

      {/* Actions */}
      <div className="flex items-center justify-start gap-2 lg:col-span-2 lg:justify-end">
        <button
          type="button"
          onClick={() => onEdit(task)}
          aria-label={`Edit ${task.title}`}
          title="Edit task"
          className="inline-flex h-9 w-9 cursor-pointer items-center justify-center rounded-xl border border-[#E8E0D1] bg-white text-[#89632F] transition-all hover:-translate-y-0.5 hover:border-[#D6B36A] hover:bg-[#FFF5DF] hover:shadow-sm focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#B68B45]"
        >
          <svg
            width="16" height="16" viewBox="0 0 24 24"
            fill="none" stroke="currentColor" strokeWidth="1.8"
            strokeLinecap="round" strokeLinejoin="round"
            aria-hidden="true"
          >
            <path d="M12 20h9" />
            <path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L9 17l-4 1 1-4Z" />
          </svg>
        </button>

        <button
          type="button"
          onClick={() => onDelete(task)}
          aria-label={`Delete ${task.title}`}
          title="Delete task"
          className="inline-flex h-9 w-9 cursor-pointer items-center justify-center rounded-xl border border-[#E8E0D1] bg-white text-[#938773] transition-all hover:-translate-y-0.5 hover:border-rose-200 hover:bg-rose-50 hover:text-rose-600 hover:shadow-sm focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-rose-400"
        >
          <svg
            width="16" height="16" viewBox="0 0 24 24"
            fill="none" stroke="currentColor" strokeWidth="1.8"
            strokeLinecap="round" strokeLinejoin="round"
            aria-hidden="true"
          >
            <path d="M3 6h18M8 6V4h8v2M19 6l-1 14H6L5 6" />
            <path d="M10 10v6M14 10v6" />
          </svg>
        </button>
      </div>
    </article>
  )
}