import { useState } from 'react'
import type { TaskStatus } from '../../types/task'
import { statusConfig } from '../ui/statusConfig'

type CreateTaskModalProps = {
  onClose: () => void
  onCreate: (title: string, description: string, status: TaskStatus) => Promise<void>
  saving: boolean
}

export default function CreateTaskModal({ onClose, onCreate, saving }: CreateTaskModalProps) {
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [status, setStatus] = useState<TaskStatus>('TODO')
  const [error, setError] = useState('')

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (!title.trim()) {
      setError('Task title is required.')
      return
    }
    void onCreate(title.trim(), description.trim(), status)
  }

  const statusStyle = statusConfig[status]

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-[#302516]/40 p-4 backdrop-blur-sm"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose()
      }}
    >
      <div role="dialog" aria-modal="true" aria-labelledby="create-task-title" className="my-auto w-full max-w-lg rounded-2xl border border-[#E9E1D3] bg-white p-6 shadow-2xl sm:p-8">
        <div className="mb-6 flex items-start justify-between">
          <div>
            <h3 id="create-task-title" className="text-xl font-bold text-[#49351B]">Create a new task</h3>
            <p className="mt-1 text-sm text-[#938773]">Add the details for your new task.</p>
          </div>
          <button onClick={onClose} aria-label="Close dialog" className="rounded-lg px-2 py-1 text-xl text-[#A19683] hover:bg-[#F7F3EA] hover:text-[#49351B]">×</button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label htmlFor="task-title" className="mb-2 block text-sm font-semibold text-[#5D4A30]">
              Task title <span className="text-red-500">*</span>
            </label>
            <input
              id="task-title"
              autoFocus
              value={title}
              onChange={(event) => { setTitle(event.target.value); setError('') }}
              maxLength={120}
              placeholder="e.g. Implement user authentication"
              className="w-full rounded-xl border border-[#E8E0D1] px-4 py-3 text-sm outline-none transition placeholder:text-[#B5AA98] focus:border-[#B68B45] focus:ring-4 focus:ring-[#F8F0DE]"
            />
            {error && <p className="mt-2 text-xs text-red-600">{error}</p>}
          </div>

          <div>
            <label htmlFor="task-description" className="mb-2 block text-sm font-semibold text-[#5D4A30]">Description</label>
            <textarea
              id="task-description"
              value={description}
              onChange={(event) => setDescription(event.target.value)}
              rows={3}
              maxLength={500}
              placeholder="Describe what needs to be done..."
              className="w-full resize-y rounded-xl border border-[#E8E0D1] px-4 py-3 text-sm outline-none transition placeholder:text-[#B5AA98] focus:border-[#B68B45] focus:ring-4 focus:ring-[#F8F0DE]"
            />
          </div>

          <div>
            <label htmlFor="task-status" className="mb-2 block text-sm font-semibold text-[#5D4A30]">Status</label>
            <select
              id="task-status"
              value={status}
              onChange={(event) => setStatus(event.target.value as TaskStatus)}
              className={`w-full rounded-xl border px-4 py-3 text-sm font-semibold outline-none transition focus:ring-4 ${statusStyle.selectClass}`}
            >
              <option className="bg-amber-50 text-amber-800" value="TODO">To Do</option>
              <option className="bg-sky-50 text-sky-700" value="IN_PROGRESS">In Progress</option>
              <option className="bg-emerald-50 text-emerald-700" value="DONE">Completed</option>
            </select>
            <p className="mt-2 text-xs text-[#A19683]">
              Status color updates automatically when you choose an option.
            </p>
          </div>

          <div className="flex flex-col-reverse gap-3 border-t border-[#F0EBDD] pt-5 sm:flex-row sm:justify-end">
            <button type="button" onClick={onClose} className="rounded-xl border border-[#E8E0D1] px-5 py-3 text-sm font-semibold text-[#746650] transition hover:bg-[#FCFAF5]">Cancel</button>
            <button type="submit" disabled={saving} className="rounded-xl bg-gradient-to-r from-[#A9803C] to-[#89632F] px-5 py-3 text-sm font-semibold text-white shadow-md shadow-[#C8B184]/30 transition hover:from-[#967032] hover:to-[#765225] disabled:cursor-not-allowed disabled:opacity-60">{saving ? 'Saving...' : 'Create Task'}</button>
          </div>
        </form>
      </div>
    </div>
  )
}
