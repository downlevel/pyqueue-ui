import React, { useEffect, useMemo, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { getQueueMessages } from '../../services/queueService';
import type { MessagePage } from '../../types';
import { formatDate } from '../../utils/helpers';

const toTitleCase = (value: string): string =>
    value
        .split(/[-_]/g)
        .map((segment) => segment.charAt(0).toUpperCase() + segment.slice(1))
        .join(' ');

const stringifyBody = (body: unknown): string => {
    if (body === null || body === undefined) {
        return 'No message body';
    }

    if (typeof body === 'string') {
        const trimmed = body.trim();
        if (!trimmed) {
            return 'No message body';
        }

        try {
            const parsed = JSON.parse(trimmed);
            return JSON.stringify(parsed, null, 2);
        } catch (error) {
            return body;
        }
    }

    try {
        return JSON.stringify(body, null, 2);
    } catch (error) {
        return String(body);
    }
};

const getBodyPreview = (body: unknown, length = 90): string => {
    const serialised = stringifyBody(body).replace(/\s+/g, ' ').trim();
    if (serialised.length <= length) {
        return serialised;
    }
    return `${serialised.slice(0, length)}…`;
};

const MessageViewer: React.FC = () => {
    const { queueId } = useParams<{ queueId: string }>();
    const [expandedId, setExpandedId] = useState<string | null>(null);
    const [page, setPage] = useState(0);
    const [pageSize, setPageSize] = useState(10);

    const offset = page * pageSize;

    const {
        data: messagePage,
        isLoading,
        isError,
        error
    } = useQuery<MessagePage, Error>({
        queryKey: ['queue', queueId, 'messages', offset, pageSize],
        queryFn: () => getQueueMessages(queueId ?? '', { limit: pageSize, offset }),
        enabled: Boolean(queueId),
        keepPreviousData: true,
        staleTime: 5_000
    });

    useEffect(() => {
        setPage(0);
        setExpandedId(null);
    }, [queueId]);

    useEffect(() => {
        if (!messagePage) {
            return;
        }

        const total = messagePage.total;
        if (total === 0) {
            if (page !== 0) {
                setPage(0);
            }
            return;
        }

        const maxPage = Math.max(0, Math.ceil(total / pageSize) - 1);
        if (page > maxPage) {
            setPage(maxPage);
            setExpandedId(null);
        }
    }, [messagePage, page, pageSize]);

    const messages = messagePage?.messages ?? [];

    const statusSummary = useMemo(() => {
        if (!messages || messages.length === 0) {
            return [];
        }

        const tally = messages.reduce<Record<string, number>>((accumulator, message) => {
            const key = message.status ?? 'unknown';
            accumulator[key] = (accumulator[key] ?? 0) + 1;
            return accumulator;
        }, {});

        return Object.entries(tally).map(([status, count]) => ({ status, count }));
    }, [messages]);

    if (!queueId) {
        return <div className="status-card error">Missing queue identifier.</div>;
    }

    if (isLoading) {
        return <div className="status-card">Loading messages…</div>;
    }

    if (isError) {
        return <div className="status-card error">{error.message}</div>;
    }

    const toggleRow = (messageId: string) => {
        setExpandedId((current) => (current === messageId ? null : messageId));
    };

    const totalMessages = messagePage ? Math.max(messagePage.total, messagePage.count, messages.length) : messages.length;

    if (messagePage && messagePage.total === 0 && messagePage.count === 0) {
        return <div className="status-card">No messages available for this queue.</div>;
    }
    const displayedFrom = totalMessages === 0 ? 0 : Math.min(offset + 1, totalMessages);
    const displayedTo = totalMessages === 0 ? 0 : Math.min(offset + messages.length, totalMessages);
    const canPrevious = page > 0;
    const canNext = messagePage?.hasMore ?? false;
    const pageCount = totalMessages > 0 ? Math.ceil(totalMessages / pageSize) : 1;

    const handlePrevious = () => {
        if (!canPrevious) {
            return;
        }
        setPage((current) => Math.max(0, current - 1));
        setExpandedId(null);
    };

    const handleNext = () => {
        if (!canNext) {
            return;
        }
        setPage((current) => current + 1);
        setExpandedId(null);
    };

    const handlePageSizeChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        const nextSize = Number(event.target.value);
        if (Number.isNaN(nextSize) || nextSize <= 0) {
            return;
        }
        setPageSize(nextSize);
        setPage(0);
        setExpandedId(null);
    };

    return (
        <section className="card message-viewer">
            <header className="message-viewer__header">
                <div>
                    <h2>Messages</h2>
                    <p className="message-viewer__subtitle">
                        Showing {displayedFrom} – {displayedTo} of {totalMessages}{' '}
                        {totalMessages === 1 ? 'message' : 'messages'}
                    </p>
                </div>
                {statusSummary.length > 0 && (
                    <ul className="message-status-summary">
                        {statusSummary.map(({ status, count }) => (
                            <li key={status}>
                                <span className="message-status-summary__count">{count}</span>
                                <span className="message-status-summary__label">
                                    {toTitleCase(status)}
                                </span>
                            </li>
                        ))}
                    </ul>
                )}
            </header>

            <div className="message-table__wrapper">
                <table className="message-table">
                    <thead>
                        <tr>
                            <th scope="col">Timestamp</th>
                            <th scope="col">Status</th>
                            <th scope="col">Receive count</th>
                            <th scope="col">Visibility timeout</th>
                            <th scope="col">Preview</th>
                            <th scope="col">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {messages.map((message) => {
                            const isExpanded = expandedId === message.id;
                            const visibilityLabel = message.visibilityTimeout
                                ? formatDate(message.visibilityTimeout)
                                : '—';
                            const statusSlug = (message.status ?? 'unknown')
                                .toLowerCase()
                                .replace(/[^a-z0-9]+/g, '-')
                                .replace(/^-+|-+$/g, '') || 'unknown';

                            return (
                                <React.Fragment key={message.id}>
                                    <tr className={isExpanded ? 'message-row message-row--expanded' : 'message-row'}>
                                        <td>{formatDate(message.timestamp)}</td>
                                        <td>
                                            <span className={`message-status message-status--${statusSlug}`}>
                                                {toTitleCase(message.status ?? 'unknown')}
                                            </span>
                                        </td>
                                        <td>{message.receiveCount ?? 0}</td>
                                        <td>{visibilityLabel}</td>
                                        <td className="message-preview" title={getBodyPreview(message.messageBody, 180)}>
                                            {getBodyPreview(message.messageBody)}
                                        </td>
                                        <td className="message-actions">
                                            <button
                                                type="button"
                                                className="button tertiary"
                                                onClick={() => toggleRow(message.id)}
                                            >
                                                {isExpanded ? 'Hide' : 'View'}
                                            </button>
                                        </td>
                                    </tr>
                                    {isExpanded && (
                                        <tr className="message-row-detail">
                                            <td colSpan={6}>
                                                <div className="message-detail">
                                                    <div className="message-detail__meta">
                                                        <div>
                                                            <span className="message-detail__label">Message ID</span>
                                                            <span className="message-detail__value">{message.id}</span>
                                                        </div>
                                                        {message.receiptHandle && (
                                                            <div>
                                                                <span className="message-detail__label">Receipt handle</span>
                                                                <span className="message-detail__value">
                                                                    {message.receiptHandle}
                                                                </span>
                                                            </div>
                                                        )}
                                                        {message.queueId && (
                                                            <div>
                                                                <span className="message-detail__label">Queue</span>
                                                                <span className="message-detail__value">
                                                                    {message.queueId}
                                                                </span>
                                                            </div>
                                                        )}
                                                    </div>
                                                    <div className="message-detail__body">
                                                        <span className="message-detail__label">Message body</span>
                                                        <pre>{stringifyBody(message.messageBody)}</pre>
                                                    </div>
                                                </div>
                                            </td>
                                        </tr>
                                    )}
                                </React.Fragment>
                            );
                        })}
                    </tbody>
                </table>
            </div>

            <footer className="message-viewer__footer">
                <div className="pagination">
                    <button
                        type="button"
                        className="button tertiary"
                        onClick={handlePrevious}
                        disabled={!canPrevious}
                    >
                        Previous
                    </button>
                    <span className="pagination__info">
                        Page {Math.min(page + 1, pageCount)} of {pageCount}
                    </span>
                    <button
                        type="button"
                        className="button tertiary"
                        onClick={handleNext}
                        disabled={!canNext}
                    >
                        Next
                    </button>
                </div>
                <label className="page-size">
                    <span>Rows per page</span>
                    <select value={pageSize} onChange={handlePageSizeChange}>
                        <option value={10}>10</option>
                        <option value={25}>25</option>
                        <option value={50}>50</option>
                        <option value={100}>100</option>
                    </select>
                </label>
            </footer>
        </section>
    );
};

export default MessageViewer;