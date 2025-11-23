import React, { useEffect, useState } from 'react';
import { getQueues } from '../../services/queueService';
import { Queue } from '../../types';

const QueueList: React.FC = () => {
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

    if (loading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>{error}</div>;
    }

    return (
        <div>
            <h2>Queue List</h2>
            <ul>
                {queues.map((queue) => (
                    <li key={queue.id}>{queue.name}</li>
                ))}
            </ul>
        </div>
    );
};

export default QueueList;