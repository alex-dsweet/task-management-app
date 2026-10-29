import type { TaskFilter, TaskStatus } from '../../types/task'

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

  return (
    <aside className="hidden w-64 shrink-0 flex-col border-r border-[#E8E0D1] bg-white md:flex">
      <div className="flex h-20 items-center gap-3 border-b border-[#F0EBDD] px-6">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-[#D9B66F] to-[#9C712E] text-xl font-bold text-white shadow-md shadow-[#D7C39B]/50">
          T
        </div>
        <div>
          <h1 className="text-lg font-bold tracking-tight text-[#49351B]">TaskFlow</h1>
          <p className="text-xs text-[#A19683]">Workspace manager</p>
        </div>
      </div>

      <div className="px-4 py-7">
        <p className="mb-3 px-3 text-xs font-bold tracking-[0.16em] text-[#B0A28B]">
          WORKSPACE
        </p>
        <nav className="space-y-1">
          {navItems.map((item) => {
            const active = activeFilter === item.filter
            return (
              <button
                key={item.filter}
                onClick={() => onFilterChange(item.filter)}
                className={`flex w-full items-center gap-3 rounded-xl px-3 py-3 text-left text-sm font-medium transition ${
                  active
                    ? 'bg-[#F8F0DE] text-[#835C20]'
                    : 'text-[#817563] hover:bg-[#FAF7F0] hover:text-[#49351B]'
                }`}
              >
                <span className="flex h-6 w-6 items-center justify-center text-lg">{item.icon}</span>
                <span className="flex-1">{item.label}</span>
                {active && <span className="h-1.5 w-1.5 rounded-full bg-[#B68B45]" />}
              </button>
            )
          })}
        </nav>

        <div className="mt-10 rounded-2xl bg-gradient-to-br from-[#A9803C] via-[#89632F] to-[#63451F] p-5 text-white shadow-lg shadow-[#B69A69]/20">
          <div className="mb-3 flex h-9 w-9 items-center justify-center rounded-lg border border-white/20 bg-white/10 text-lg">✦</div>
          <h3 className="font-semibold">Stay productive</h3>
          <p className="mt-2 text-xs leading-5 text-[#F4E8D0]">
            Keep your tasks organized and make progress every day.
          </p>
          <div className="mt-4 h-1.5 overflow-hidden rounded-full bg-white/20">
            <div className="h-full rounded-full bg-[#F2D69A] transition-all" style={{ width: `${progress}%` }} />
          </div>
          <p className="mt-2 text-xs text-[#F4E8D0]">{completed} of {total} tasks completed</p>
        </div>
      </div>

      <div className="mt-auto border-t border-[#F0EBDD] p-5">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full border border-[#E8D8B8] bg-[#F8F0DE] font-bold text-[#89632F]">M</div>
          <div className="min-w-0">
            <p className="truncate text-sm font-semibold text-[#49351B]">My Workspace</p>
            <p className="text-xs text-[#A19683]">Personal account</p>
          </div>
        </div>
      </div>
    </aside>
  )
}
