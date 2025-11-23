import { useQuery } from '@tanstack/react-query';
import { getQueues } from '../services/queueService';
import type { Queue } from '../types';

const useQueue = () => {
    const { data, isLoading, isError, error } = useQuery<Queue[], Error>({
        queryKey: ['queues'],
        queryFn: getQueues
    });

    return {
        queues: data ?? [],
        loading: isLoading,
        error: isError ? error?.message ?? 'Failed to fetch queues.' : null
    };
};

export default useQueue;