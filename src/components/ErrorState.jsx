export default function ErrorState({ message, onRetry }) {
    return (
        <div className="flex-1 p-6 md:p-10 bg-slate-50 min-h-screen flex flex-col items-center justify-center">
            <div className="max-w-md w-full bg-white border border-slate-100 p-8 rounded-2xl shadow-sm text-center">
                <div className="w-16 h-16 bg-red-50 text-red-500 rounded-2xl flex items-center justify-center mx-auto mb-6">
                    <svg
                        className="w-8 h-8"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        viewBox="0 0 24 24"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                        />
                    </svg>
                </div>

                <h2 className="text-xl font-bold text-slate-800 mb-2">
                    Failed to load rates
                </h2>

                <p className="text-sm text-slate-500 mb-6">{message}</p>

                <button
                    onClick={onRetry}
                    className="w-full px-5 py-3 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white font-semibold rounded-2xl shadow-md shadow-blue-200 transition-colors focus:outline-none"
                >
                    Retry Connection
                </button>
            </div>
        </div>
    );
}