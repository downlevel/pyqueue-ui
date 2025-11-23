import React from 'react';
import { Link, useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { getQueueDetails } from '../../services/queueService';
import type { Queue } from '../../types';
import { formatDate } from '../../utils/helpers';

const QueueDetails: React.FC = () => {
    const { queueId } = useParams<{ queueId: string }>();

    const {
        data: queue,
        isLoading,
        isError,
        error
    } = useQuery<Queue, Error>({
        queryKey: ['queue', queueId],
        queryFn: () => getQueueDetails(queueId ?? ''),
        enabled: Boolean(queueId)
    });

    if (!queueId) {
        return <div className="status-card error">Missing queue identifier.</div>;
    }

    if (isLoading) {
        return <div className="status-card">Loading queue details…</div>;
    }

    if (isError) {
        return <div className="status-card error">{error.message}</div>;
    }

    if (!queue) {
        return <div className="status-card">Queue not found.</div>;
    }

    return (
        <section className="card queue-details">
            <h2>{queue.name}</h2>
            <dl className="queue-meta">
                <div>
                    <dt>Queue ID</dt>
                    <dd>{queue.id}</dd>
                </div>
                <div>
                    <dt>Created</dt>
                    <dd>{formatDate(queue.createdAt)}</dd>
                </div>
                <div>
                    <dt>Updated</dt>
                    <dd>{formatDate(queue.updatedAt)}</dd>
                </div>
            </dl>
            <div className="actions">
                <Link className="button" to={`/queues/${queueId}/messages`}>
                    View messages
                </Link>
            </div>
        </section>
    );
};

export default QueueDetails;