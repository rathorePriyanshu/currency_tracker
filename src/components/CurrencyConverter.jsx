export default function CurrencyConverter({
    converterAmount,
    setConverterAmount,
    converterFrom,
    setConverterFrom,
    converterTo,
    setConverterTo,
    getConversionResult,
    getTargetExchangeRate,
    CURRENCY_DETAILS,
}) {
    return (
        <div className="space-y-6">
            <h2 className="text-lg font-bold text-slate-800 tracking-tight">
                Exchange Calculator
            </h2>

            <div className="bg-white border border-slate-100 rounded-2xl p-6 shadow-sm flex flex-col gap-5">
                <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                        Amount
                    </label>

                    <div className="relative">
                        <input
                            type="text"
                            value={converterAmount}
                            onChange={(e) => {
                                const val = e.target.value;

                                if (val === '' || /^\d*\.?\d*$/.test(val)) {
                                    setConverterAmount(val);
                                }
                            }}
                            placeholder="Enter amount..."
                            className="w-full bg-slate-50 border border-slate-200/60 rounded-xl px-4 py-3 text-lg font-extrabold text-slate-800 outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all shadow-inner"
                        />

                        <span className="absolute right-4 top-1/2 -translate-y-1/2 text-sm font-extrabold text-slate-400">
                            {converterFrom}
                        </span>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex flex-col gap-1.5">
                        <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                            From
                        </label>

                        <select
                            value={converterFrom}
                            onChange={(e) => setConverterFrom(e.target.value)}
                            className="w-full bg-slate-50 border border-slate-200/60 rounded-xl px-3.5 py-3 text-sm font-semibold text-slate-700 outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all shadow-sm"
                        >
                            {Object.keys(CURRENCY_DETAILS).map((code) => (
                                <option key={code} value={code}>
                                    {code} {CURRENCY_DETAILS[code].flag}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="flex flex-col gap-1.5">
                        <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                            To
                        </label>

                        <select
                            value={converterTo}
                            onChange={(e) => setConverterTo(e.target.value)}
                            className="w-full bg-slate-50 border border-slate-200/60 rounded-xl px-3.5 py-3 text-sm font-semibold text-slate-700 outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all shadow-sm"
                        >
                            {Object.keys(CURRENCY_DETAILS).map((code) => (
                                <option key={code} value={code}>
                                    {code} {CURRENCY_DETAILS[code].flag}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>

                <div className="mt-2 bg-blue-50/50 border border-blue-100/30 rounded-2xl p-5 flex flex-col items-center text-center">
                    <span className="text-xs font-bold text-blue-500/80 uppercase tracking-widest">
                        Converted Amount
                    </span>

                    <span className="text-3xl font-extrabold text-blue-600 tracking-tight mt-2.5 break-all max-w-full">
                        {getConversionResult()} {converterTo}
                    </span>

                    {getTargetExchangeRate() && (
                        <span className="text-xs font-semibold text-slate-400 mt-2 bg-white px-3 py-1 rounded-full border border-slate-100 shadow-inner">
                            {getTargetExchangeRate()}
                        </span>
                    )}
                </div>
            </div>
        </div>
    );
}