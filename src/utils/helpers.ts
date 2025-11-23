import axios from 'axios';

export const formatDate = (dateString?: string): string => {
    if (!dateString) {
        return '—';
    }

    const date = new Date(dateString);

    if (Number.isNaN(date.getTime())) {
        return dateString;
    }

    const options: Intl.DateTimeFormatOptions = {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    };

    return date.toLocaleString(undefined, options);
};

export const handleApiError = (error: unknown): string => {
    if (axios.isAxiosError(error)) {
        return (
            (error.response?.data as { message?: string } | undefined)?.message ??
            error.message ??
            'API request failed.'
        );
    }

    if (error instanceof Error) {
        return error.message;
    }

    return 'Unexpected error.';
};

export const capitalizeFirstLetter = (value: string): string => {
    if (!value) {
        return value;
    }

    return value.charAt(0).toUpperCase() + value.slice(1);
};