type TaskStatsProps = {
  total: number
  todo: number
  inProgress: number
  done: number
}

const cards = [
  { key: 'total', label: 'Total Tasks', note: 'Tasks in your workspace', color: 'bg-[#D9B778]', number: '01' },
  { key: 'todo', label: 'To Do', note: 'Waiting to get started', color: 'bg-amber-400', number: '02' },
  { key: 'inProgress', label: 'In Progress', note: 'Currently in progress', color: 'bg-sky-400', number: '03' },
  { key: 'done', label: 'Completed', note: 'Successfully finished', color: 'bg-emerald-500', number: '04' },
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
      {cards.map((card) => {
        const percentage = props.total > 0
          ? Math.round((values[card.key] / props.total) * 100)
          : 0

        const isTotal = card.key === 'total'

        return (
          <div
            key={card.key}
            className={`group relative flex min-h-52 flex-col justify-between overflow-hidden rounded-2xl border p-6 transition-all duration-300 hover:-translate-y-1 ${isTotal
              ? 'border-[#8B704B] bg-[#8B704B] text-white shadow-lg shadow-[#8B704B]/15 hover:shadow-xl'
              : 'border-[#E9E1D3] bg-white text-[#49351B] shadow-sm shadow-[#8C7349]/5 hover:border-[#D7C39B] hover:shadow-lg hover:shadow-[#8C7349]/10'
              }`}
          >
            {/* Header */}
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className={`text-xs font-semibold uppercase tracking-[0.12em] ${isTotal ? 'text-[#F8E6BF]' : 'text-[#938773]'
                  }`}>
                  {card.label}
                </p>
                <p className={`mt-1.5 text-xs ${isTotal ? 'text-[#F0DFC5]' : 'text-[#A19683]'
                  }`}>
                  {card.note}
                </p>
              </div>

              <span className={`text-xs font-semibold tracking-widest ${isTotal ? 'text-[#E9D2A9]' : 'text-[#D1C5B3]'
                }`}>
                {card.number}
              </span>
            </div>

            {/* Main Value */}
            <div className="mt-7">
              <div className="flex items-end justify-between gap-3">
                <p className={`text-5xl font-bold leading-none tracking-tight tabular-nums ${isTotal ? 'text-white' : 'text-[#49351B]'
                  }`}>
                  {values[card.key].toLocaleString()}
                </p>

                {isTotal && (
                  <span className="text-[10px] font-semibold uppercase tracking-widest text-[#F8E6BF]">
                    Overview
                  </span>
                )}
              </div>

              {/* Progress */}
              <div className="mt-6">
                <div className="mb-2.5 flex items-center justify-between">
                  <span className={`text-[11px] ${isTotal ? 'text-[#F0DFC5]' : 'text-[#A19683]'
                    }`}>
                    {isTotal ? 'All workspace tasks' : 'Share of total'}
                  </span>

                  <span className={`text-xs font-bold tabular-nums ${isTotal ? 'text-[#F8E6BF]' : 'text-[#817563]'
                    }`}>
                    {percentage}%
                  </span>
                </div>

                <div className={`h-1.5 overflow-hidden rounded-full ${isTotal ? 'bg-white/20' : 'bg-[#F0EBE2]'
                  }`}>
                  <div
                    className={`h-full rounded-full ${card.color} transition-all duration-500`}
                    style={{ width: `${percentage}%` }}
                  />
                </div>
              </div>
            </div>
          </div>
        )
      })}
    </section>
  )
}