import type { TaskFilter } from '../../types/task'

type SidebarProps = {
  activeFilter: TaskFilter
  onFilterChange: (filter: TaskFilter) => void
  total: number
  completed: number
}

const navItems: { label: string; icon: string; filter: TaskFilter }[] = [
  { label: 'All Tasks', icon: '▦', filter: 'ALL' },
  { label: 'To Do', icon: '○', filter: 'TODO' },
  { label: 'In Progress', icon: '◷', filter: 'IN_PROGRESS' },
  { label: 'Completed', icon: '✓', filter: 'DONE' },
]

export default function Sidebar({
  activeFilter,
  onFilterChange,
  total,
  completed,
}: SidebarProps) {
  const progress = total ? (completed / total) * 100 : 0
  const radius = 54
  const circumference = 2 * Math.PI * radius
  const progressOffset = circumference * (1 - progress / 100)

  return (
    <aside className="hidden w-64 shrink-0 flex-col border-r border-[#E8E0D1] bg-[#FFFEFC] md:flex">
      {/* Brand */}
      <div className="flex h-20 items-center gap-3 border-b border-[#F0EBDD] px-6">
        <div className="relative flex h-11 w-11 items-center justify-center overflow-hidden rounded-2xl bg-[#8B704B] text-white shadow-md shadow-[#8B704B]/20">
          <svg width="25" height="25" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <rect x="4" y="4" width="16" height="16" rx="4" />
            <path d="m8 12 2.5 2.5L16 9" />
          </svg>
        </div>
        <div>
          <h1 className="text-lg font-bold tracking-tight text-[#49351B]">
            Task<span className="text-[#A9803C]">Flow</span>
          </h1>
          <p className="text-[11px] font-medium tracking-wide text-[#A19683]">
            WORKSPACE MANAGER
          </p>
        </div>
      </div>

      {/* Navigation */}
      <div className="flex-1 px-4 py-7">
        <div className="mb-4 flex items-center justify-between px-3">
          <p className="text-[10px] font-bold tracking-[0.18em] text-[#B0A28B]">
            WORKSPACE
          </p>
          <span className="h-px w-10 bg-[#E9DFC9]" />
        </div>

        <nav className="space-y-1.5" aria-label="Task navigation">
          {navItems.map((item) => {
            const active = activeFilter === item.filter

            return (
              <button
                key={item.filter}
                type="button"
                onClick={() => onFilterChange(item.filter)}
                aria-current={active ? 'page' : undefined}
                className={`group relative flex w-full cursor-pointer items-center gap-3 overflow-hidden rounded-xl px-3.5 py-3 text-left text-sm font-medium transition-all duration-200 ${
                  active
                    ? 'bg-[#F6F0E5] font-semibold text-[#785A32]'
                    : 'text-[#817563] hover:bg-[#F9F6F0] hover:text-[#49351B]'
                }`}
              >
                {active && (
                  <span className="absolute inset-y-2 left-0 w-[3px] rounded-r-full bg-[#B68B45]" />
                )}

                <span className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg transition-colors ${
                  active
                    ? 'bg-white text-[#A9803C] shadow-sm'
                    : 'bg-transparent text-[#A19683] group-hover:bg-white group-hover:text-[#A9803C]'
                }`}>
                  {item.filter === 'ALL' && (
                    <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                      <rect x="3" y="3" width="7" height="7" rx="1.5" />
                      <rect x="14" y="3" width="7" height="7" rx="1.5" />
                      <rect x="3" y="14" width="7" height="7" rx="1.5" />
                      <rect x="14" y="14" width="7" height="7" rx="1.5" />
                    </svg>
                  )}
                  {item.filter === 'TODO' && (
                    <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                      <circle cx="12" cy="12" r="9" />
                      <path d="M8 12h8" />
                    </svg>
                  )}
                  {item.filter === 'IN_PROGRESS' && (
                    <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                      <circle cx="12" cy="12" r="9" />
                      <path d="M12 7v5l3 2" />
                    </svg>
                  )}
                  {item.filter === 'DONE' && (
                    <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                      <circle cx="12" cy="12" r="9" />
                      <path d="m8 12 2.5 2.5L16 9" />
                    </svg>
                  )}
                </span>

                <span className="flex-1">{item.label}</span>

                {item.filter === 'ALL' && (
                  <span className={`rounded-md px-2 py-0.5 text-[11px] font-bold tabular-nums ${
                    active ? 'bg-white text-[#89632F]' : 'bg-[#F4F0E9] text-[#A19683]'
                  }`}>
                    {total}
                  </span>
                )}

                {item.filter === 'DONE' && (
                  <span className={`rounded-md px-2 py-0.5 text-[11px] font-bold tabular-nums ${
                    active ? 'bg-white text-[#89632F]' : 'bg-[#F4F0E9] text-[#A19683]'
                  }`}>
                    {completed}
                  </span>
                )}
              </button>
            )
          })}
        </nav>

        {/* Task Completion Chart */}
        <div className="mt-10 overflow-hidden rounded-2xl border border-[#E9DFC9] bg-white p-5 shadow-sm shadow-[#8C7349]/5">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold uppercase tracking-[0.15em] text-[#A9803C]">
              Task Completion
            </span>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#B68B45" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M21.21 15.89A10 10 0 1 1 8.11 2.99" />
              <path d="M22 12A10 10 0 0 0 12 2v10z" />
            </svg>
          </div>

          <div className="mt-4 flex flex-col items-center">
            <div className="relative h-36 w-36">
              <svg
                viewBox="0 0 140 140"
                className="h-full w-full -rotate-90"
                role="img"
                aria-label={`${Math.round(progress)}% of tasks completed`}
              >
                <circle
                  cx="70"
                  cy="70"
                  r={radius}
                  fill="none"
                  stroke="#F0EBE2"
                  strokeWidth="11"
                />
                <circle
                  cx="70"
                  cy="70"
                  r={radius}
                  fill="none"
                  stroke="#B68B45"
                  strokeWidth="11"
                  strokeLinecap="round"
                  strokeDasharray={circumference}
                  strokeDashoffset={progressOffset}
                  className="transition-all duration-700 ease-out"
                />
              </svg>

              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-3xl font-bold tracking-tight tabular-nums text-[#49351B]">
                  {Math.round(progress)}%
                </span>
                <span className="mt-1 text-[10px] font-medium text-[#A19683]">
                  Completed
                </span>
              </div>
            </div>

            <div className="mt-4 w-full border-t border-[#F0EBDD] pt-4 text-center">
              <p className="text-xs text-[#938773]">
                <span className="font-bold text-[#785A32]">{completed}</span> of {total} tasks completed
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Workspace Footer */}
      <div className="border-t border-[#F0EBDD] p-4">
        <div className="flex items-center gap-3 rounded-xl px-2 py-2">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-[#E8D8B8] bg-[#F8F0DE] font-bold text-[#89632F]">
            A
          </div>
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-semibold text-[#49351B]">
              alex.dsweet
            </p>
            <p className="text-xs text-[#A19683]">
              Personal account
            </p>
          </div>
          <span className="h-2 w-2 rounded-full bg-emerald-400" title="alex.dsweet" />
        </div>
      </div>
    </aside>
  )
}