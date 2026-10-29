import type { Task, TaskStatus } from '../../types/task'
import StatusBadge from '../ui/StatusBadge'
import { statusConfig } from '../ui/statusConfig'

type TaskItemProps = {
  task: Task
  onStatusChange: (id: number, status: TaskStatus) => void
  onDelete: (task: Task) => void
}

export default function TaskItem({ task, onStatusChange, onDelete }: TaskItemProps) {
  const statusStyle = statusConfig[task.status]

  return (
    <article className="grid grid-cols-1 gap-4 px-5 py-5 transition hover:bg-[#FEFDF9] md:grid-cols-12 md:items-center md:gap-4 md:px-6">
      <div className="min-w-0 md:col-span-6">
        <h4 className="break-words text-sm font-semibold text-[#49351B]">{task.title}</h4>
        <p className="mt-1.5 break-words text-xs leading-5 text-[#A19683]">
          {task.description || 'No description provided.'}
        </p>
      </div>

      <div className="md:col-span-3">
        <div className="mb-2 md:hidden">
          <StatusBadge status={task.status} />
        </div>
        <select
          value={task.status}
          onChange={(event) => onStatusChange(task.id, event.target.value as TaskStatus)}
          aria-label={`Status for ${task.title}`}
          className={`cursor-pointer rounded-full border px-3 py-1.5 text-xs font-semibold outline-none ring-1 ring-inset transition focus:ring-2 ${statusStyle.selectClass}`}
        >
          <option className="bg-amber-50 text-amber-800" value="TODO">To Do</option>
          <option className="bg-sky-50 text-sky-700" value="IN_PROGRESS">In Progress</option>
          <option className="bg-emerald-50 text-emerald-700" value="DONE">Completed</option>
        </select>
      </div>

      <div className="text-xs text-[#A19683] md:col-span-2">
        <span className="mr-2 md:hidden">Created:</span>{task.createdAt ? new Date(task.createdAt).toLocaleDateString() : '—'}
      </div>

      <div className="flex justify-end md:col-span-1">
        <button
          onClick={() => onDelete(task)}
          aria-label={`Delete ${task.title}`}
          title="Delete task"
          className="rounded-lg border border-[#E8E0D1] px-3 py-1.5 text-xs font-medium text-[#817563] transition hover:border-red-200 hover:bg-red-50 hover:text-red-600"
        >
          Delete
        </button>
      </div>
    </article>
  )
}
