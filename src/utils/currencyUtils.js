export const getSortedRates = (rates, pinned) => {
    if (!rates) return [];

    return Object.entries(rates).sort(([codeA], [codeB]) => {
        const pinA = pinned.includes(codeA);
        const pinB = pinned.includes(codeB);

        if (pinA && !pinB) return -1;
        if (!pinA && pinB) return 1;

        return codeA.localeCompare(codeB);
    });
};

export const getConversionResult = (
    ratesData,
    converterAmount,
    converterFrom,
    converterTo
) => {
    if (!ratesData?.rates) {
        return '0.00';
    }

    const amount = parseFloat(converterAmount);

    if (isNaN(amount) || amount <= 0) {
        return '0.00';
    }

    const ratesWithBase = {
        [ratesData.base]: 1,
        ...ratesData.rates,
    };

    const fromRate = ratesWithBase[converterFrom];
    const toRate = ratesWithBase[converterTo];

    if (!fromRate || !toRate) {
        return '0.00';
    }

    const result = amount * (toRate / fromRate);

    return result.toLocaleString(undefined, {
        minimumFractionDigits: 2,
        maximumFractionDigits: 4,
    });
};

export const getTargetExchangeRate = (
    ratesData,
    converterFrom,
    converterTo
) => {
    if (!ratesData?.rates) {
        return '';
    }

    const ratesWithBase = {
        [ratesData.base]: 1,
        ...ratesData.rates,
    };

    const fromRate = ratesWithBase[converterFrom];
    const toRate = ratesWithBase[converterTo];

    if (!fromRate || !toRate) {
        return '';
    }

    const rate = toRate / fromRate;

    return `1 ${converterFrom} = ${rate.toFixed(4)} ${converterTo}`;
};