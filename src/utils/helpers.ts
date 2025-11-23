// This file contains utility functions that assist with various tasks in the application, such as formatting data or handling errors.

export const formatDate = (dateString: string): string => {
    const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
};

export const handleApiError = (error: any): string => {
    if (error.response) {
        return error.response.data.message || 'An error occurred';
    }
    return 'Network error';
};

export const capitalizeFirstLetter = (string: string): string => {
    return string.charAt(0).toUpperCase() + string.slice(1);
};