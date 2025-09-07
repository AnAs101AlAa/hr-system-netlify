type FormatMode = 'full' | 'hour';

const formatDateTime = (date: Date, mode: FormatMode = 'full') => {
    if (mode === 'hour') {
        return date.toLocaleString('en-US', {
            hour: 'numeric',
            hour12: true
        });
    }
    return date.toLocaleString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        hour12: true
    });
};

export default formatDateTime;