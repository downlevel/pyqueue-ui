import React from 'react';
import { useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { getQueueMessages } from '../../services/queueService';
import type { Message } from '../../types';
import { formatDate } from '../../utils/helpers';

const MessageViewer: React.FC = () => {
    const { queueId } = useParams<{ queueId: string }>();

    const {
        data: messages,
        isLoading,
        isError,
        error
    } = useQuery<Message[], Error>({
        queryKey: ['queue', queueId, 'messages'],
        queryFn: () => getQueueMessages(queueId ?? ''),
        enabled: Boolean(queueId)
    });

    if (!queueId) {
        return <div className="status-card error">Missing queue identifier.</div>;
    }

    if (isLoading) {
        return <div className="status-card">Loading messages…</div>;
    }

    if (isError) {
        return <div className="status-card error">{error.message}</div>;
    }

    if (!messages || messages.length === 0) {
        return <div className="status-card">No messages available for this queue.</div>;
    }

    return (
        <section className="card message-viewer">
            <h2>Messages</h2>
            <ul className="message-list">
                {messages.map((message) => (
                    <li key={message.id} className="message-item">
                        <h3>{formatDate(message.timestamp)}</h3>
                        <pre>{message.content}</pre>
                    </li>
                ))}
            </ul>
        </section>
    );
};

export default MessageViewer;