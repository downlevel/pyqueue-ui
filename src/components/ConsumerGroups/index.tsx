import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { getConsumerGroups } from '../../services/queueService';
import type { ConsumerGroup } from '../../types';

const ConsumerGroups: React.FC = () => {
    const { data, isLoading, isError, error } = useQuery<ConsumerGroup[], Error>({
        queryKey: ['consumer-groups'],
        queryFn: getConsumerGroups
    });

    if (isLoading) {
        return <div className="status-card">Loading consumer groups…</div>;
    }

    if (isError) {
        return <div className="status-card error">{error.message}</div>;
    }

    const groups = data ?? [];

    if (groups.length === 0) {
        return <div className="status-card">No consumer groups registered.</div>;
    }

    return (
        <section className="card consumer-groups">
            <h2>Consumer Groups</h2>
            <ul>
                {groups.map((group) => (
                    <li key={group.id} className="consumer-group">
                        <h3>{group.name}</h3>
                        <p>Members: {group.members.length}</p>
                    </li>
                ))}
            </ul>
        </section>
    );
};

export default ConsumerGroups;