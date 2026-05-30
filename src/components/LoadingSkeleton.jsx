export default function LoadingSkeleton() {
    return (
        <div className="flex-1 p-6 md:p-10 bg-slate-50 min-h-screen">
            <div className="flex flex-col gap-2 mb-10 animate-pulse">
                <div className="h-9 bg-slate-200 rounded-lg w-64" />
                <div className="h-4 bg-slate-200 rounded-lg w-96" />
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
                <div className="xl:col-span-2 space-y-6">
                    <div className="h-6 bg-slate-200 rounded-lg w-40 animate-pulse" />

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {[...Array(6)].map((_, i) => (
                            <div
                                key={i}
                                className="animate-pulse bg-white border border-slate-100 rounded-2xl p-5 flex items-center justify-between shadow-sm"
                            >
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 bg-slate-200 rounded-2xl" />

                                    <div className="space-y-2">
                                        <div className="h-4 bg-slate-200 rounded w-20" />
                                        <div className="h-3 bg-slate-200 rounded w-32" />
                                    </div>
                                </div>

                                <div className="h-6 bg-slate-200 rounded w-16" />
                            </div>
                        ))}
                    </div>
                </div>

                <div className="h-[400px] bg-slate-200 rounded-2xl animate-pulse" />
            </div>
        </div>
    );
}