import React from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { getQueues } from '../../services/queueService';
import type { Queue } from '../../types';
import { formatDate } from '../../utils/helpers';

const QueueList: React.FC = () => {
    const { data, isLoading, isError, error } = useQuery<Queue[], Error>({
        queryKey: ['queues'],
        queryFn: getQueues
    });

    if (isLoading) {
        return <div className="status-card">Loading queues…</div>;
    }

    if (isError) {
        return <div className="status-card error">{error.message}</div>;
    }

    if (!data || data.length === 0) {
        return <div className="status-card">No queues found. Create a queue to get started.</div>;
    }

    return (
        <section className="card">
            <h2>Queues</h2>
            <ul className="queue-list">
                {data.map((queue) => (
                    <li key={queue.id} className="queue-item">
                        <div>
                            <h3>{queue.name}</h3>
                            <p>Created: {formatDate(queue.createdAt)}</p>
                            <p>Updated: {formatDate(queue.updatedAt)}</p>
                        </div>
                        <Link className="button" to={`/queues/${queue.id}`}>
                            View details
                        </Link>
                    </li>
                ))}
            </ul>
        </section>
    );
};

export default QueueList;