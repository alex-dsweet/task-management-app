import type { Task } from '../../types/task'

type DeleteTaskModalProps = {
  task: Task
  onCancel: () => void
  onConfirm: () => void
  saving: boolean
}

export default function DeleteTaskModal({ task, onCancel, onConfirm, saving }: DeleteTaskModalProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#302516]/40 p-4 backdrop-blur-sm">
      <div role="alertdialog" aria-modal="true" aria-labelledby="delete-task-title" className="w-full max-w-sm rounded-2xl border border-[#E9E1D3] bg-white p-6 shadow-2xl">
        <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-red-50 text-xl text-red-600">!</div>
        <h3 id="delete-task-title" className="text-lg font-bold text-[#49351B]">Delete this task?</h3>
        <p className="mt-2 break-words text-sm leading-6 text-[#938773]">
          Are you sure you want to delete “{task.title}”? This action cannot be undone.
        </p>
        <div className="mt-6 flex justify-end gap-3">
          <button onClick={onCancel} className="rounded-xl border border-[#E8E0D1] px-4 py-2.5 text-sm font-semibold text-[#746650] hover:bg-[#FCFAF5]">Cancel</button>
          <button onClick={onConfirm} disabled={saving} className="rounded-xl bg-red-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-60">{saving ? 'Deleting...' : 'Delete task'}</button>
        </div>
      </div>
    </div>
  )
}
