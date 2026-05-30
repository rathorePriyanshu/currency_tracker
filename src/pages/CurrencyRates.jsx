import { useState, useEffect, useRef } from 'react';

import RateCard from '../components/RateCard';
import CurrencyConverter from '../components/CurrencyConverter';
import LoadingSkeleton from '../components/LoadingSkeleton';
import ErrorState from '../components/ErrorState';
import { CURRENCY_DETAILS } from '../constants/currencies';
import { getSortedRates, getConversionResult, getTargetExchangeRate } from '../utils/currencyUtils';
import { updateRelativeTime } from '../utils/timeUtils';

export default function CurrencyRates() {
  const [ratesData, setRatesData] = useState(null);

  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const [error, setError] = useState(null);

  const [baseCurrency, setBaseCurrency] = useState('USD');

  const [relativeTime, setRelativeTime] = useState('');

  const [converterAmount, setConverterAmount] = useState('100');
  const [converterFrom, setConverterFrom] = useState('USD');
  const [converterTo, setConverterTo] = useState('INR');

  const [pinned, setPinned] = useState(() => {
    const saved = localStorage.getItem('payflo_pinned_currencies');

    return saved ? JSON.parse(saved) : [];
  });

  const abortControllerRef = useRef(null);

  const loadRates = async (isBackground = false) => {
    if (!isBackground) {
      setIsLoading(true);
      setError(null);
    } else {
      setIsRefreshing(true);
    }

    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    abortControllerRef.current = new AbortController();

    try {
      const response = await fetch(
        `http://localhost:8000/api/rates/live.php?base=${baseCurrency}`,
        {
          signal: abortControllerRef.current.signal,
        }
      );

      if (!response.ok) {
        throw new Error(
          `Server returned HTTP status ${response.status}`
        );
      }

      const result = await response.json();

      if (result?.success) {
        setRatesData(result);
        setError(null);
      } else if (result?.cached && result?.rates) {
        setRatesData(result);

        setError({
          type: 'warning',
          message:
            result.error ||
            'Failed to fetch fresh rates. Displaying stale cache.',
        });
      } else {
        throw new Error(
          result?.error || 'Failed to fetch currency rates.'
        );
      }
    } catch (err) {
      if (err.name !== 'AbortError') {
        setError({
          type: 'error',
          message:
            err.message ||
            'Unable to connect to the rates service.',
        });
      }
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    loadRates(false);

    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, [baseCurrency]);

  useEffect(() => {
    const interval = setInterval(() => {
      loadRates(true);
    }, 60000);

    return () => clearInterval(interval);
  }, [baseCurrency]);

  useEffect(() => {
    const refreshTime = () => {
      setRelativeTime(updateRelativeTime(ratesData));
    };

    refreshTime();

    const interval = setInterval(refreshTime, 10000);

    return () => clearInterval(interval);
  }, [ratesData]);

  const togglePin = (code) => {
    setPinned((prev) => {
      const next = prev.includes(code)
        ? prev.filter((c) => c !== code)
        : [...prev, code];

      localStorage.setItem(
        'payflo_pinned_currencies',
        JSON.stringify(next)
      );

      return next;
    });
  };

  if (isLoading) {
    return <LoadingSkeleton />;
  }

  if (
    error &&
    error.type === 'error' &&
    (!ratesData || !ratesData.rates)
  ) {
    return (
      <ErrorState
        message={error.message}
        onRetry={() => loadRates(false)}
      />
    );
  }

  const sortedRates = getSortedRates(
    ratesData?.rates,
    pinned
  );

  return (
    <div className="flex-1 p-6 md:p-10 bg-slate-50 min-h-screen overflow-y-auto">

      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8 pb-6 border-b border-slate-100">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
            Live Exchange Rates
          </h1>

          <p className="text-sm font-medium text-slate-500 mt-1">
            Real-time currency rates and conversions for
            agent link generation.
          </p>

          {relativeTime && (
            <p className="text-xs text-slate-400 font-semibold mt-1">
              {relativeTime}
            </p>
          )}
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-slate-500">
              Base
            </span>

            <select
              value={baseCurrency}
              onChange={(e) =>
                setBaseCurrency(e.target.value)
              }
              className="bg-white border border-slate-200 text-sm font-medium text-slate-700 rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-blue-500/20 shadow-sm"
            >
              {Object.keys(CURRENCY_DETAILS).map((code) => (
                <option key={code} value={code}>
                  {CURRENCY_DETAILS[code].flag} {code}
                </option>
              ))}
            </select>
          </div>

          <button
            onClick={() => loadRates(true)}
            disabled={isRefreshing}
            className="h-10 w-10 flex items-center justify-center bg-white border border-slate-200 rounded-lg shadow-sm hover:bg-slate-50 disabled:opacity-50"
            title="Refresh exchange rates"
          >
            <span
              className={`text-lg ${isRefreshing ? 'animate-spin' : ''
                }`}
            >
              🔄
            </span>
          </button>
        </div>
      </div>

      {error && error.type === 'warning' && (
        <div className="flex items-center gap-3 p-4 mb-6 bg-amber-50 border border-amber-200/60 rounded-2xl text-amber-800 text-sm font-semibold">
          <svg
            className="w-5 h-5 text-amber-600 shrink-0"
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

          <span>{error.message}</span>
        </div>
      )}

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        <div className="xl:col-span-2 space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-slate-800 tracking-tight">
              Exchange Rates vs {baseCurrency}
            </h2>

            <span className="text-xs bg-slate-100 text-slate-500 font-semibold px-2 py-1 rounded-full">
              {sortedRates.length} currencies
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {sortedRates.map(([code, rate]) => {
              const meta =
                CURRENCY_DETAILS[code] || {
                  name: 'Unknown',
                  flag: '🏳️',
                };

              const isPinned = pinned.includes(code);

              return (
                <RateCard
                  key={code}
                  code={code}
                  rate={rate}
                  meta={meta}
                  isPinned={isPinned}
                  baseCurrency={baseCurrency}
                  onTogglePin={togglePin}
                />
              );
            })}
          </div>
        </div>

        <CurrencyConverter
          converterAmount={converterAmount}
          setConverterAmount={setConverterAmount}
          converterFrom={converterFrom}
          setConverterFrom={setConverterFrom}
          converterTo={converterTo}
          setConverterTo={setConverterTo}
          getConversionResult={() =>
            getConversionResult(
              ratesData,
              converterAmount,
              converterFrom,
              converterTo
            )
          }
          getTargetExchangeRate={() =>
            getTargetExchangeRate(
              ratesData,
              converterFrom,
              converterTo
            )
          }
          CURRENCY_DETAILS={CURRENCY_DETAILS}
        />
      </div>
    </div>
  );
}