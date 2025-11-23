import React from 'react';
import { Link, useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { getQueueDetails } from '../../services/queueService';
import type { Queue } from '../../types';

const toTitleCase = (value: string): string =>
    value
        .split(/[-_]/g)
        .map((segment) => segment.charAt(0).toUpperCase() + segment.slice(1))
        .join(' ');

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

    const displayName = toTitleCase(queue.queueName);

    const totalForBar = Math.max(
        queue.messageCount,
        queue.availableMessages + queue.inFlightMessages
    );
    const availablePercent =
        totalForBar > 0 ? Math.round((queue.availableMessages / totalForBar) * 100) : 0;
    const inFlightPercent =
        totalForBar > 0 ? Math.round((queue.inFlightMessages / totalForBar) * 100) : 0;
    const remainingPercent = Math.max(0, 100 - availablePercent - inFlightPercent);

    return (
        <section className="card queue-details">
            <header className="queue-details__header">
                <div>
                    <h2>{displayName}</h2>
                    <p className="queue-details__subtitle">
                        {queue.messageCount} {queue.messageCount === 1 ? 'message' : 'messages'} total
                    </p>
                </div>
                {queue.permissions.length > 0 && (
                    <div className="queue-details__permissions">
                        {queue.permissions.map((permission: string) => (
                            <span key={permission} className="queue-permission">
                                {toTitleCase(permission)}
                            </span>
                        ))}
                    </div>
                )}
            </header>

            <div className="queue-details__grid">
                <div className="queue-stat-card">
                    <span className="queue-stat-card__label">Available</span>
                    <span className="queue-stat-card__value">{queue.availableMessages}</span>
                </div>
                <div className="queue-stat-card">
                    <span className="queue-stat-card__label">In flight</span>
                    <span className="queue-stat-card__value">{queue.inFlightMessages}</span>
                </div>
                <div className="queue-stat-card">
                    <span className="queue-stat-card__label">Queue ID</span>
                    <span className="queue-stat-card__value queue-stat-card__value--code">
                        {queue.id}
                    </span>
                </div>
            </div>

            <div className="queue-capacity queue-capacity--detail">
                <div className="queue-capacity__legend">
                    <span>Available</span>
                    <span>In flight</span>
                </div>
                <div className="queue-capacity__bar queue-capacity__bar--detail">
                    <span
                        className="queue-capacity__segment queue-capacity__segment--available"
                        style={{ width: `${availablePercent}%` }}
                    />
                    <span
                        className="queue-capacity__segment queue-capacity__segment--inflight"
                        style={{ width: `${inFlightPercent}%` }}
                    />
                    {remainingPercent > 0 && (
                        <span
                            className="queue-capacity__segment queue-capacity__segment--other"
                            style={{ width: `${remainingPercent}%` }}
                        />
                    )}
                </div>
            </div>

            <div className="queue-details__actions">
                <Link
                    className="button"
                    to={`/queues/${encodeURIComponent(queue.queueName)}/messages`}
                >
                    Browse messages
                </Link>
                <Link className="button secondary" to="/">
                    Back to queues
                </Link>
            </div>
        </section>
    );
};

export default QueueDetails;