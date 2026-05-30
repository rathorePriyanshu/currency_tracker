export const updateRelativeTime = (ratesData) => {
    if (!ratesData?.updated_at) {
        return '';
    }

    const serverTime = new Date(
        ratesData.updated_at.replace(' ', 'T') + 'Z'
    ).getTime();

    if (isNaN(serverTime)) {
        return `Last updated: ${ratesData.updated_at}`;
    }

    const now = Date.now();

    const diffSecs = Math.max(
        0,
        Math.floor((now - serverTime) / 1000)
    );

    if (diffSecs < 60) {
        return 'Last updated just now';
    }

    const diffMins = Math.floor(diffSecs / 60);

    if (diffMins < 60) {
        return `Last updated ${diffMins} ${diffMins === 1 ? 'minute' : 'minutes'
            } ago`;
    }

    const diffHours = Math.floor(diffMins / 60);

    if (diffHours < 24) {
        return `Last updated ${diffHours} ${diffHours === 1 ? 'hour' : 'hours'
            } ago`;
    }

    const diffDays = Math.floor(diffHours / 24);

    if (diffDays < 7) {
        return `Last updated ${diffDays} ${diffDays === 1 ? 'day' : 'days'
            } ago`;
    }

    const diffWeeks = Math.floor(diffDays / 7);

    if (diffWeeks < 4) {
        return `Last updated ${diffWeeks} ${diffWeeks === 1 ? 'week' : 'weeks'
            } ago`;
    }

    const diffMonths = Math.floor(diffDays / 30);

    return `Last updated ${diffMonths} ${diffMonths === 1 ? 'month' : 'months'
        } ago`;
};