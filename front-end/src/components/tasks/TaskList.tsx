import type { Task, TaskStatus } from '../../types/task'
import TaskItem from './TaskItem'
import EmptyState from '../ui/EmptyState'

type TaskListProps = {
  tasks: Task[]
  totalTasks: number
  onStatusChange: (id: number, status: TaskStatus) => void
  onDelete: (task: Task) => void
  onCreateTask: () => void
}

export default function TaskList({
  tasks,
  totalTasks,
  onStatusChange,
  onDelete,
  onCreateTask,
}: TaskListProps) {
  return (
    <section className="overflow-hidden rounded-2xl border border-[#E9E1D3] bg-white shadow-sm shadow-[#8C7349]/5">
      <div className="hidden grid-cols-12 gap-4 bg-[#FCFAF5] px-6 py-3 text-[11px] font-bold uppercase tracking-wider text-[#A19683] md:grid">
        <div className="col-span-6">Task</div>
        <div className="col-span-3">Status</div>
        <div className="col-span-2">Created</div>
        <div className="col-span-1 text-right">Action</div>
      </div>

      <div className="divide-y divide-[#F0EBDD]">
        {tasks.length > 0 ? (
          tasks.map((task) => (
            <TaskItem key={task.id} task={task} onStatusChange={onStatusChange} onDelete={onDelete} />
          ))
        ) : (
          <EmptyState onCreateTask={onCreateTask} />
        )}
      </div>

      <div className="flex flex-col gap-2 border-t border-[#F0EBDD] bg-[#FCFAF5] px-5 py-4 text-xs text-[#A19683] sm:flex-row sm:items-center sm:justify-between sm:px-6">
        <span>Showing {tasks.length} of {totalTasks} tasks</span>
        <span>TaskFlow Workspace</span>
      </div>
    </section>
  )
}
