type EmptyStateProps = {
  onCreateTask: () => void
}

export default function EmptyState({ onCreateTask }: EmptyStateProps) {
  return (
    <div className="px-6 py-16 text-center">
      <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-[#F8F0DE] text-2xl text-[#946B2D]">
        ⌕
      </div>
      <h4 className="mt-4 font-semibold text-[#49351B]">No tasks found</h4>
      <p className="mt-1 text-sm text-[#A19683]">
        Try another search or create a new task.
      </p>
      <button
        onClick={onCreateTask}
        className="mt-4 text-sm font-semibold text-[#946B2D] hover:text-[#63451F]"
      >
        + Create a task
      </button>
    </div>
  )
}
