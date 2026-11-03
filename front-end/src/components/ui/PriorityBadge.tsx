import type { TaskPriority } from '../../types/task'

type PriorityBadgeProps = {
  priority: TaskPriority
}

const priorityConfig: Record<
  TaskPriority,
  { label: string; className: string }
> = {
  LOW: {
    label: 'Low',
    className: 'border-blue-500 bg-blue-50',
  },
  MEDIUM: {
    label: 'Medium',
    className: 'border-amber-500 bg-amber-50',
  },
  HIGH: {
    label: 'High',
    className: 'border-red-500 bg-red-50',
  },
}

export default function PriorityBadge({ priority }: PriorityBadgeProps) {
  const config = priorityConfig[priority]

  return (
    <span
      title={`${config.label} Priority`}
      aria-label={`${config.label} Priority`}
      role="img"
      className={`inline-block h-4 w-4 shrink-0 rounded-full border-2 ${config.className}`}
    />
  )
}