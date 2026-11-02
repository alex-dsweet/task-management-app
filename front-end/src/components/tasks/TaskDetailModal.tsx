import type { Task, TaskPriority, TaskStatus } from '../../types/task'

type TaskDetailModalProps = {
    task: Task
    onClose: () => void
    onEdit: (task: Task) => void
}

type BadgeConfig = {
    label: string
    style: string
    dot: string
}

const statusConfig: Record<TaskStatus, BadgeConfig> = {
    TODO: {
        label: 'To Do',
        style: 'border-amber-200 bg-amber-50 text-amber-700',
        dot: 'bg-amber-500',
    },
    IN_PROGRESS: {
        label: 'In Progress',
        style: 'border-sky-200 bg-sky-50 text-sky-700',
        dot: 'bg-sky-500',
    },
    DONE: {
        label: 'Completed',
        style: 'border-emerald-200 bg-emerald-50 text-emerald-700',
        dot: 'bg-emerald-500',
    },
}

const priorityConfig: Record<TaskPriority, BadgeConfig> = {
    LOW: {
        label: 'Low Priority',
        style: 'border-slate-200 bg-slate-50 text-slate-600',
        dot: 'bg-slate-400',
    },
    MEDIUM: {
        label: 'Medium Priority',
        style: 'border-amber-200 bg-amber-50 text-amber-700',
        dot: 'bg-amber-500',
    },
    HIGH: {
        label: 'High Priority',
        style: 'border-rose-200 bg-rose-50 text-rose-700',
        dot: 'bg-rose-500',
    },
}

function formatDateTime(value: string | null | undefined) {
    if (!value) return 'Not available'

    const date = new Date(value)
    if (Number.isNaN(date.getTime())) return 'Invalid date'

    return date.toLocaleString('en-GB', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
    })
}

function formatDueDate(value: string | null | undefined) {
    if (!value) return 'No deadline'
    const [year, month, day] = value.slice(0, 10).split('-')
    return `${day}/${month}/${year}`
}

function getTodayLocal() {
    const now = new Date()
    const year = now.getFullYear()
    const month = String(now.getMonth() + 1).padStart(2, '0')
    const day = String(now.getDate()).padStart(2, '0')
    return `${year}-${month}-${day}`
}

export default function TaskDetailModal({
    task, onClose, onEdit,
}: TaskDetailModalProps) {
    const today = getTodayLocal()
    const hasDeadline = !!task.dueDate
    const isCompleted = task.status === 'DONE'
    const isOverdue = hasDeadline && !isCompleted && task.dueDate! < today
    const isDueToday = hasDeadline && !isCompleted && task.dueDate === today

    const status = statusConfig[task.status]
    const priority = priorityConfig[task.priority]

    const dueDateStyle = isOverdue
        ? 'border-rose-200 bg-rose-50'
        : isDueToday
            ? 'border-orange-200 bg-orange-50'
            : isCompleted
                ? 'border-emerald-200 bg-emerald-50/60'
                : 'border-[#F0E3C8] bg-[#FFFBF2]'

    const dueDateTextStyle = isOverdue
        ? 'text-rose-700'
        : isDueToday
            ? 'text-orange-700'
            : isCompleted
                ? 'text-emerald-700'
                : 'text-[#89632F]'

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-[#302516]/55 p-3 backdrop-blur-sm"
            onMouseDown={(event) => {
                if (event.target === event.currentTarget) onClose()
            }}
        >
            <div
                role="dialog"
                aria-modal="true"
                aria-labelledby="task-detail-title"
                className="my-auto flex max-h-[95vh] w-full max-w-xl flex-col overflow-hidden rounded-3xl border border-[#E9E1D3] bg-white shadow-2xl"
            >
                <div className="relative shrink-0 overflow-hidden bg-gradient-to-r from-[#FFF2D5] via-[#FFFAF0] to-white px-6 py-4 sm:px-7">
                    <div className="pointer-events-none absolute -right-12 -top-16 h-36 w-36 rounded-full bg-[#F4D99D]/25 blur-2xl" />

                    <div className="relative flex items-start justify-between gap-3">
                        <div className="min-w-0">
                            <div className="mb-2 flex flex-wrap items-center gap-2">
                                <span className="rounded-full border border-[#EAD7AF] bg-white/70 px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.15em] text-[#A9803C]">
                                    Task Overview
                                </span>
                                <span className="text-xs font-medium text-[#A19683]">#{task.id}</span>
                            </div>

                            <h3 id="task-detail-title"
                                className="break-words text-xl font-bold tracking-tight text-[#49351B]">
                                {task.title}
                            </h3>
                            <p className="mt-1 text-xs text-[#938773]">
                                View your task information and activity.
                            </p>
                        </div>

                        <button type="button" onClick={onClose} aria-label="Close dialog"
                            className="shrink-0 cursor-pointer rounded-xl border border-[#EADFCB] bg-white/80 px-3 py-1.5 text-lg text-[#938773] transition hover:bg-[#F3E7CF] hover:text-[#49351B]">
                            ×
                        </button>
                    </div>
                </div>

                <div className="min-h-0 flex-1 space-y-4 overflow-y-auto px-6 py-4 sm:px-7">
                    <div className="grid grid-cols-2 gap-3">
                        <div className="rounded-xl border border-[#F0EBDD] bg-[#FCFAF5] p-3">
                            <p className="mb-2 text-[11px] font-bold uppercase tracking-wider text-[#A19683]">
                                Status
                            </p>
                            <span className={`inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-xs font-bold ${status.style}`}>
                                <span className={`h-2 w-2 rounded-full ${status.dot}`} />
                                {status.label}
                            </span>
                        </div>

                        <div className="rounded-xl border border-[#F0EBDD] bg-[#FCFAF5] p-3">
                            <p className="mb-2 text-[11px] font-bold uppercase tracking-wider text-[#A19683]">
                                Priority
                            </p>
                            <span className={`inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-xs font-bold ${priority.style}`}>
                                <span className={`h-2 w-2 rounded-full ${priority.dot}`} />
                                {priority.label}
                            </span>
                        </div>
                    </div>

                    <section>
                        <div className="mb-2 flex items-center justify-between">
                            <h4 className="text-sm font-bold text-[#49351B]">Description</h4>
                            <span className="text-[11px] text-[#B5AA98]">Task details</span>
                        </div>

                        <div className="min-h-16 whitespace-pre-wrap break-words rounded-xl border border-[#F0EBDD] bg-[#FFFEFC] p-3 text-sm leading-6 text-[#746650]">
                            {task.description || (
                                <span className="italic text-[#B5AA98]">No description provided.</span>
                            )}
                        </div>
                    </section>

                    <section>
                        <h4 className="mb-2 text-sm font-bold text-[#49351B]">Schedule</h4>
                        <div className={`rounded-xl border p-3 ${dueDateStyle}`}>
                            <div className="flex flex-wrap items-center justify-between gap-3">
                                <div>
                                    <p className="mb-1 text-[11px] font-semibold text-[#938773]">
                                        Due Date
                                    </p>
                                    <p className={`text-base font-bold ${dueDateTextStyle}`}>
                                        {formatDueDate(task.dueDate)}
                                    </p>
                                </div>

                                {isOverdue && (
                                    <span className="rounded-full bg-rose-100 px-3 py-1 text-xs font-bold text-rose-700">
                                        Overdue
                                    </span>
                                )}
                                {isDueToday && (
                                    <span className="rounded-full bg-orange-100 px-3 py-1 text-xs font-bold text-orange-700">
                                        Due Today
                                    </span>
                                )}
                                {isCompleted && hasDeadline && (
                                    <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-bold text-emerald-700">
                                        Completed
                                    </span>
                                )}
                                {!hasDeadline && (
                                    <span className="rounded-full border border-[#EADFCB] bg-white px-3 py-1 text-xs font-semibold text-[#A19683]">
                                        Not Set
                                    </span>
                                )}
                            </div>
                        </div>
                    </section>

                    <section>
                        <div className="mb-2 flex items-center justify-between">
                            <h4 className="text-sm font-bold text-[#49351B]">Activity Timeline</h4>
                            <span className="rounded-full bg-[#F7F3EA] px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-[#A9803C]">
                                History
                            </span>
                        </div>

                        <div className="relative ml-2 border-l-2 border-[#EDE5D6] pl-5">
                            <TimelineItem label="Created"
                                value={formatDateTime(task.createdAt)} color="bg-sky-500" />
                            <TimelineItem label="Last Updated"
                                value={formatDateTime(task.updatedAt)} color="bg-amber-500" />
                            <TimelineItem label="Completed"
                                value={task.completedAt ? formatDateTime(task.completedAt) : 'Not completed yet'}
                                color={task.completedAt ? 'bg-emerald-500' : 'bg-slate-300'}
                                last
                            />
                        </div>
                    </section>
                </div>

                <div className="flex shrink-0 flex-col-reverse gap-3 border-t border-[#F0EBDD] bg-[#FCFAF5] px-6 py-3 sm:flex-row sm:justify-end sm:px-7">
                    <button type="button" onClick={onClose}
                        className="cursor-pointer rounded-xl border border-[#E8E0D1] bg-white px-5 py-2.5 text-sm font-semibold text-[#746650] transition hover:bg-[#F7F3EA]">
                        Close
                    </button>
                    <button type="button" onClick={() => onEdit(task)}
                        className="cursor-pointer rounded-xl bg-gradient-to-r from-[#A9803C] to-[#89632F] px-6 py-2.5 text-sm font-semibold text-white shadow-lg shadow-[#C8B184]/30 transition hover:-translate-y-0.5 hover:from-[#967032] hover:to-[#765225]">
                        Edit Task
                    </button>
                </div>
            </div>
        </div>
    )
}

type TimelineItemProps = {
    label: string
    value: string
    color: string
    last?: boolean
}

function TimelineItem({ label, value, color, last = false }: TimelineItemProps) {
    return (
        <div className={`relative ${last ? '' : 'pb-3'}`}>
            <span className={`absolute -left-[26px] top-2 h-3 w-3 rounded-full border-2 border-white shadow-sm ${color}`} />
            <div className="rounded-xl border border-[#F0EBDD] bg-white px-3 py-2 shadow-sm shadow-[#8C7349]/5">
                <p className="mb-0.5 text-[11px] font-semibold text-[#A19683]">{label}</p>
                <p className="break-words text-xs font-semibold text-[#49351B]">{value}</p>
            </div>
        </div>
    )
}