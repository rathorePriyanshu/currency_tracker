export default function RateCard({
    code,
    rate,
    meta,
    isPinned,
    baseCurrency,
    onTogglePin,
}) {
    return (
        <div className="bg-white border border-slate-100 rounded-2xl p-5 flex items-center justify-between shadow-sm hover:shadow-md transition-shadow relative group">
            <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-slate-50 rounded-2xl flex items-center justify-center text-2xl shadow-inner">
                    <img
                        src={meta.image}
                        alt={code}
                        className="w-7 h-7 rounded-full object-cover"
                    />
                </div>

                <div className="flex flex-col">
                    <div className="flex items-center gap-1.5">
                        <span className="font-extrabold text-slate-800 tracking-tight">
                            {code}
                        </span>

                        <span className="text-xs text-slate-400 font-bold">•</span>

                        <span className="text-xs text-slate-400 font-bold tracking-tight truncate max-w-[120px]">
                            {meta.name}
                        </span>
                    </div>

                    <span className="text-xs text-slate-400 font-semibold mt-1">
                        1 {baseCurrency} = {rate} {code}
                    </span>
                </div>
            </div>

            <button
                onClick={() => onTogglePin(code)}
                className={`p-2 rounded-xl border border-transparent transition-colors focus:outline-none ${isPinned
                    ? 'text-amber-500 hover:bg-amber-50'
                    : 'text-slate-400 hover:text-slate-600 hover:bg-slate-50'
                    }`}
                title={isPinned ? 'Unpin currency' : 'Pin currency to top'}
            >
                <svg
                    className="w-4 h-4"
                    fill={isPinned ? 'currentColor' : 'none'}
                    stroke="currentColor"
                    strokeWidth="2"
                    viewBox="0 0 24 24"
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.907c.961 0 1.36 1.243.577 1.83l-3.97 2.88a1 1 0 00-.364 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.971-2.88a1 1 0 00-1.178 0l-3.97 2.88c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.364-1.118l-3.97-2.88c-.783-.57-.38-1.83.58-1.83h4.907a1 1 0 00.95-.69l1.519-4.674z"
                    />
                </svg>
            </button>
        </div>
    );
}