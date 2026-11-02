import type { TaskFilter, PriorityFilter } from '../../types/task'

type TaskToolbarProps = {
  search: string
  onSearchChange: (value: string) => void
  statusFilter: TaskFilter
  onStatusFilterChange: (value: TaskFilter) => void
  priorityFilter: PriorityFilter
  onPriorityFilterChange: (value: PriorityFilter) => void
  resultCount: number
  sortBy: string
  onSortByChange: (value: string) => void
  direction: 'asc' | 'desc'
  onDirectionChange: (value: 'asc' | 'desc') => void
  onCreateTask: () => void
}

const selectClass = 'cursor-pointer rounded-xl border border-[#E8E0D1] bg-white text-sm font-medium text-[#746650] outline-none transition-all duration-200 hover:border-[#D6BD91] focus:border-[#B68B45] focus:ring-4 focus:ring-[#F8F0DE]'
const activeFilterClass = 'border-[#D6B36A] bg-[#FFFAF0] text-[#89632F]'

export default function TaskToolbar({
  search, onSearchChange, statusFilter, onStatusFilterChange,
  priorityFilter, onPriorityFilterChange, resultCount,
  sortBy, onSortByChange, direction, onDirectionChange, onCreateTask,
}: TaskToolbarProps) {
  const hasActiveFilters = !!search.trim() || statusFilter !== 'ALL' || priorityFilter !== 'ALL'

  function clearFilters() {
    onSearchChange('')
    onStatusFilterChange('ALL')
    onPriorityFilterChange('ALL')
  }

  return (
    <>
      <div className="flex flex-col justify-between gap-4 border-b border-[#F0EBDD] bg-gradient-to-r from-[#FFFCF6] to-white px-5 py-5 sm:flex-row sm:items-center sm:px-6">
        <div>
          <h3 className="text-base font-bold tracking-tight text-[#49351B]">All Tasks</h3>
          <p className="mt-1 text-xs text-[#A19683]">Manage and track your tasks.</p>
        </div>
        <span className="self-start rounded-xl border border-[#E9DFC9] bg-white px-3.5 py-2 text-xs font-bold text-[#89632F] shadow-sm sm:self-auto">
          {resultCount} tasks
        </span>
      </div>

      <div className="flex flex-col gap-4 border-b border-[#F0EBDD] px-5 py-5 sm:px-6">
        <div className="flex flex-col gap-3 lg:flex-row">
          <div className="relative min-w-0 flex-1">
            <span className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-[#A9803C]">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none"
                stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" aria-hidden="true">
                <circle cx="11" cy="11" r="7" />
                <path d="m20 20-4-4" />
              </svg>
            </span>
            <input type="search" value={search}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Search by title or description..."
              className="w-full rounded-xl border border-[#E8E0D1] bg-white py-3 pl-10 pr-4 text-sm text-[#49351B] shadow-sm outline-none transition-all duration-200 placeholder:text-[#B5AA98] hover:border-[#D6BD91] focus:border-[#B68B45] focus:ring-4 focus:ring-[#F8F0DE]"
            />
          </div>

          <select value={statusFilter}
            onChange={(e) => onStatusFilterChange(e.target.value as TaskFilter)}
            aria-label="Filter by status"
            className={`${selectClass} px-4 py-3 shadow-sm ${statusFilter !== 'ALL' ? activeFilterClass : ''}`}>
            <option value="ALL">All statuses</option>
            <option value="TODO">To Do</option>
            <option value="IN_PROGRESS">In Progress</option>
            <option value="DONE">Completed</option>
          </select>

          <select value={priorityFilter}
            onChange={(e) => onPriorityFilterChange(e.target.value as PriorityFilter)}
            aria-label="Filter by priority"
            className={`${selectClass} px-4 py-3 shadow-sm ${priorityFilter !== 'ALL' ? activeFilterClass : ''}`}>
            <option value="ALL">All priorities</option>
            <option value="LOW">Low</option>
            <option value="MEDIUM">Medium</option>
            <option value="HIGH">High</option>
          </select>
        </div>

        <div className="flex flex-col gap-3 border-t border-[#F5F0E8] pt-4 sm:flex-row sm:items-center">
          <span className="text-xs font-semibold text-[#A19683]">SORT BY</span>

          <select value={sortBy}
            onChange={(e) => onSortByChange(e.target.value)}
            aria-label="Sort by" className={`${selectClass} px-4 py-2.5`}>
            <option value="createdAt">Created Date</option>
            <option value="title">Title</option>
            <option value="status">Status</option>
            <option value="priority">Priority</option>
          </select>

          <select value={direction}
            onChange={(e) => onDirectionChange(e.target.value as 'asc' | 'desc')}
            aria-label="Sort direction" className={`${selectClass} px-4 py-2.5`}>
            <option value="desc">Descending</option>
            <option value="asc">Ascending</option>
          </select>

          <div className="flex flex-wrap items-center gap-3 sm:ml-auto">
            {hasActiveFilters && (
              <button type="button" onClick={clearFilters}
                className="cursor-pointer rounded-lg px-3 py-2 text-xs font-semibold text-[#A9803C] transition hover:bg-[#FFF5E3] hover:text-[#89632F]">
                Clear Filters
              </button>
            )}

            <button type="button" onClick={onCreateTask}
              className="inline-flex cursor-pointer items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#A9803C] to-[#89632F] px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:-translate-y-0.5 hover:from-[#967032] hover:to-[#765225]">
              <span className="text-lg leading-none">+</span>
              Create Task
            </button>
          </div>
        </div>
      </div>
    </>
  )
}