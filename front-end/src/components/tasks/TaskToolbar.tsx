import type { TaskFilter } from '../../types/task'

type TaskToolbarProps = {
  search: string
  onSearchChange: (value: string) => void
  statusFilter: TaskFilter
  onStatusFilterChange: (value: TaskFilter) => void
  resultCount: number
}

export default function TaskToolbar({
  search,
  onSearchChange,
  statusFilter,
  onStatusFilterChange,
  resultCount,
}: TaskToolbarProps) {
  return (
    <>
      <div className="flex flex-col justify-between gap-4 border-b border-[#F0EBDD] px-5 py-5 sm:flex-row sm:items-center sm:px-6">
        <div>
          <h3 className="font-bold text-[#49351B]">All Tasks</h3>
          <p className="mt-1 text-xs text-[#A19683]">Manage and track your tasks.</p>
        </div>
        <span className="self-start rounded-lg border border-[#E9DFC9] bg-[#FBF7ED] px-3 py-1.5 text-xs font-semibold text-[#89632F] sm:self-auto">
          {resultCount} tasks
        </span>
      </div>
      <div className="flex flex-col gap-3 border-b border-[#F0EBDD] px-5 py-4 sm:flex-row sm:px-6">
        <div className="relative flex-1">
          <span className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-[#A19683]">⌕</span>
          <input
            type="search"
            value={search}
            onChange={(event) => onSearchChange(event.target.value)}
            placeholder="Search by title or description..."
            className="w-full rounded-xl border border-[#E8E0D1] bg-[#FCFBF8] py-2.5 pl-10 pr-4 text-sm outline-none transition placeholder:text-[#B5AA98] focus:border-[#B68B45] focus:bg-white focus:ring-4 focus:ring-[#F8F0DE]"
          />
        </div>
        <select
          value={statusFilter}
          onChange={(event) => onStatusFilterChange(event.target.value as TaskFilter)}
          aria-label="Filter by status"
          className="rounded-xl border border-[#E8E0D1] bg-white px-4 py-2.5 text-sm text-[#746650] outline-none focus:border-[#B68B45] focus:ring-4 focus:ring-[#F8F0DE]"
        >
          <option value="ALL">All statuses</option>
          <option value="TODO">To Do</option>
          <option value="IN_PROGRESS">In Progress</option>
          <option value="DONE">Completed</option>
        </select>
      </div>
    </>
  )
}
