import { useEffect, useState } from 'react';
import { getQueues } from '../services/queueService';
import { Queue } from '../types';

const useQueue = () => {
    const [queues, setQueues] = useState<Queue[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchQueues = async () => {
            try {
                const data = await getQueues();
                setQueues(data);
            } catch (err) {
                setError('Failed to fetch queues');
            } finally {
                setLoading(false);
            }
        };

        fetchQueues();
    }, []);

    return { queues, loading, error };
};

export default useQueue;