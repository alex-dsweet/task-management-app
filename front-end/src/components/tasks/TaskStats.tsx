type TaskStatsProps = {
  total: number
  todo: number
  inProgress: number
  done: number
}

const cards = [
  { key: 'total', label: 'Total Tasks', note: 'Tasks in your workspace', icon: '▦', iconStyle: 'bg-[#F8F0DE] text-[#946B2D]' },
  { key: 'todo', label: 'To Do', note: 'Waiting to get started', icon: '○', iconStyle: 'bg-amber-50 text-amber-700' },
  { key: 'inProgress', label: 'In Progress', note: 'Currently in progress', icon: '◷', iconStyle: 'bg-sky-50 text-sky-700' },
  { key: 'done', label: 'Completed', note: 'Successfully finished', icon: '✓', iconStyle: 'bg-emerald-50 text-emerald-700' },
] as const

export default function TaskStats(props: TaskStatsProps) {
  const values = {
    total: props.total,
    todo: props.todo,
    inProgress: props.inProgress,
    done: props.done,
  }

  return (
    <section className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {cards.map((card) => (
        <div key={card.key} className="rounded-2xl border border-[#E9E1D3] bg-white p-5 shadow-sm shadow-[#8C7349]/5 transition hover:-translate-y-0.5 hover:border-[#D7C39B] hover:shadow-md">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-[#817563]">{card.label}</span>
            <span className={`flex h-10 w-10 items-center justify-center rounded-xl text-xl ${card.iconStyle}`}>{card.icon}</span>
          </div>
          <p className="mt-5 text-3xl font-bold tracking-tight text-[#49351B]">{values[card.key]}</p>
          <p className="mt-2 text-xs text-[#A19683]">{card.note}</p>
        </div>
      ))}
    </section>
  )
}
