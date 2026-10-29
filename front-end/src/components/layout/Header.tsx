export default function Header() {
  return (
    <header className="flex h-20 items-center justify-between border-b border-[#E8E0D1] bg-white px-5 sm:px-8 lg:px-10">
      <div>
        <p className="text-xs text-[#A19683]">Workspace / Tasks</p>
        <p className="mt-1 text-sm font-semibold text-[#49351B]">Task Management</p>
      </div>
      <div className="flex items-center gap-3">
        <span className="hidden rounded-full border border-[#E9DFC9] bg-[#FBF7ED] px-3 py-1.5 text-xs font-medium text-[#89632F] sm:inline-flex">
          <span className="mr-2 mt-1 h-1.5 w-1.5 rounded-full bg-emerald-500" />
          Workspace active
        </span>
        <div className="flex h-10 w-10 items-center justify-center rounded-full border border-[#E8D8B8] bg-[#F8F0DE] font-bold text-[#89632F] ring-4 ring-[#FBF8F1]">M</div>
      </div>
    </header>
  )
}
