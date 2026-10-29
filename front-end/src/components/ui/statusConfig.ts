import type { TaskStatus } from '../../types/task'

export const statusConfig: Record<
  TaskStatus,
  { label: string; badgeClass: string; selectClass: string; dotClass: string }
> = {
  TODO: {
    label: 'To Do',
    badgeClass: 'bg-amber-50 text-amber-800 ring-amber-200',
    selectClass: 'border-amber-200 bg-amber-50 text-amber-800 focus:ring-amber-200',
    dotClass: 'bg-amber-500',
  },
  IN_PROGRESS: {
    label: 'In Progress',
    badgeClass: 'bg-sky-50 text-sky-700 ring-sky-200',
    selectClass: 'border-sky-200 bg-sky-50 text-sky-700 focus:ring-sky-200',
    dotClass: 'bg-sky-500',
  },
  DONE: {
    label: 'Completed',
    badgeClass: 'bg-emerald-50 text-emerald-700 ring-emerald-200',
    selectClass: 'border-emerald-200 bg-emerald-50 text-emerald-700 focus:ring-emerald-200',
    dotClass: 'bg-emerald-500',
  },
}
