import React from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { getQueues } from '../../services/queueService';
import type { Queue, QueueCollection } from '../../types';

const toTitleCase = (value: string): string =>
    value
        .split(/[-_]/g)
        .map((segment) => segment.charAt(0).toUpperCase() + segment.slice(1))
        .join(' ');

const QueueList: React.FC = () => {
    const { data, isLoading, isError, error } = useQuery<QueueCollection, Error>({
        queryKey: ['queues'],
        queryFn: getQueues
    });

    if (isLoading) {
        return <div className="status-card">Loading queues…</div>;
    }

    if (isError) {
        return <div className="status-card error">{error.message}</div>;
    }

    const queues: Queue[] = data?.queues ?? [];
    const totalQueues = data?.count ?? queues.length;
    const totalMessages = queues.reduce<number>((sum, queue) => sum + queue.messageCount, 0);
    const totalAvailable = queues.reduce<number>((sum, queue) => sum + queue.availableMessages, 0);
    const totalInFlight = queues.reduce<number>((sum, queue) => sum + queue.inFlightMessages, 0);

    return (
        <div className="queue-page">
            <section className="card queue-summary">
                <h2>Queue overview</h2>
                <div className="summary-grid">
                    <div className="summary-tile">
                        <p className="summary-label">Queues</p>
                        <p className="summary-value">{totalQueues}</p>
                    </div>
                    <div className="summary-tile">
                        <p className="summary-label">Total messages</p>
                        <p className="summary-value">{totalMessages}</p>
                    </div>
                    <div className="summary-tile">
                        <p className="summary-label">Available</p>
                        <p className="summary-value">{totalAvailable}</p>
                    </div>
                    <div className="summary-tile">
                        <p className="summary-label">In flight</p>
                        <p className="summary-value">{totalInFlight}</p>
                    </div>
                </div>
                {data?.apiKeyDescription && (
                    <p className="summary-note">API key: {data.apiKeyDescription}</p>
                )}
            </section>

            <section className="card queue-collection">
                <div className="queue-collection__header">
                    <h2>Queues</h2>
                    <span className="queue-collection__meta">
                        Showing {queues.length} of {totalQueues}
                    </span>
                </div>

                {queues.length === 0 ? (
                    <div className="status-card">No queues found. Create a queue to get started.</div>
                ) : (
                    <div className="queue-grid">
                        {queues.map((queue) => {
                            const totalForBar = Math.max(
                                queue.messageCount,
                                queue.availableMessages + queue.inFlightMessages
                            );
                            const availablePercent =
                                totalForBar > 0
                                    ? Math.round((queue.availableMessages / totalForBar) * 100)
                                    : 0;
                            const inFlightPercent =
                                totalForBar > 0
                                    ? Math.round((queue.inFlightMessages / totalForBar) * 100)
                                    : 0;
                            const remainingPercent = Math.max(
                                0,
                                100 - availablePercent - inFlightPercent
                            );

                            return (
                                <article key={queue.id} className="queue-card">
                                    <header className="queue-card__header">
                                        <div>
                                            <h3>{toTitleCase(queue.queueName)}</h3>
                                            <p className="queue-card__subtitle">{queue.queueName}</p>
                                        </div>
                                        <span className="queue-card__badge">
                                            {queue.messageCount}{' '}
                                            {queue.messageCount === 1 ? 'message' : 'messages'}
                                        </span>
                                    </header>

                                    <div className="queue-card__stats">
                                        <div className="queue-stat">
                                            <span className="queue-stat__label">Available</span>
                                            <span className="queue-stat__value">
                                                {queue.availableMessages}
                                            </span>
                                        </div>
                                        <div className="queue-stat">
                                            <span className="queue-stat__label">In flight</span>
                                            <span className="queue-stat__value">
                                                {queue.inFlightMessages}
                                            </span>
                                        </div>
                                        <div className="queue-stat">
                                            <span className="queue-stat__label">Permissions</span>
                                            <span className="queue-stat__value">
                                                {queue.permissions.length}
                                            </span>
                                        </div>
                                    </div>

                                    {queue.permissions.length > 0 && (
                                        <div className="queue-card__permissions">
                                            {queue.permissions.map((permission: string) => (
                                                <span key={permission} className="queue-permission">
                                                    {toTitleCase(permission)}
                                                </span>
                                            ))}
                                        </div>
                                    )}

                                    <div className="queue-capacity">
                                        <div className="queue-capacity__legend">
                                            <span>Available</span>
                                            <span>In flight</span>
                                        </div>
                                        <div className="queue-capacity__bar">
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

                                    <div className="queue-card__actions">
                                        <Link className="button" to={`/queues/${encodeURIComponent(queue.queueName)}`}>
                                            View details
                                        </Link>
                                        <Link
                                            className="button secondary"
                                            to={`/queues/${encodeURIComponent(queue.queueName)}/messages`}
                                        >
                                            Browse messages
                                        </Link>
                                    </div>
                                </article>
                            );
                        })}
                    </div>
                )}
            </section>
        </div>
    );
};

export default QueueList;