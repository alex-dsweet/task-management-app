import type { Task, TaskStatus } from '../../types/task'
import TaskItem from './TaskItem'
import EmptyState from '../ui/EmptyState'

type TaskListProps = {
  tasks: Task[]
  totalTasks: number
  onStatusChange: (id: number, status: TaskStatus) => void
  onEdit: (task: Task) => void
  onDelete: (task: Task) => void
  onCreateTask: () => void
  onView: (task: Task) => void
}

export default function TaskList({
  tasks,
  totalTasks,
  onStatusChange,
  onEdit,
  onDelete,
  onCreateTask,
  onView,
}: TaskListProps) {
  return (
    <section className="overflow-hidden bg-white">
      {/* Table Header */}
      <div className="hidden grid-cols-12 items-center gap-4 border-b border-[#F0EBDD] bg-gradient-to-r from-[#FFFBF3] to-white px-6 py-4 text-[11px] font-bold uppercase tracking-[0.12em] text-[#A19683] lg:grid">
        <div className="col-span-5">Task Information</div>
        <div className="col-span-2">Status</div>
        <div className="col-span-2">Deadline</div>
        <div className="col-span-1">Created</div>
        <div className="col-span-2 text-right">Actions</div>
      </div>

      {/* Task Rows */}
      <div className="divide-y divide-[#F0EBDD]">
        {tasks.length > 0 ? (
          tasks.map((task) => (
            <TaskItem
              key={task.id}
              task={task}
              onStatusChange={onStatusChange}
              onEdit={onEdit}
              onDelete={onDelete}
              onView={onView}
            />
          ))
        ) : (
          <EmptyState onCreateTask={onCreateTask} />
        )}
      </div>

      {/* List Footer */}
      {tasks.length > 0 && (
        <div className="flex flex-wrap items-center justify-between gap-2 border-t border-[#F0EBDD] bg-[#FFFEFC] px-6 py-3">
          <div className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-emerald-400" />
            <span className="text-xs font-medium text-[#938773]">
              {tasks.length} tasks displayed
            </span>
          </div>

          <span className="rounded-full border border-[#EFE5D4] bg-[#FCFAF5] px-3 py-1 text-[11px] font-semibold text-[#A9803C]">
            {totalTasks} total results
          </span>
        </div>
      )}
    </section>
  )
}