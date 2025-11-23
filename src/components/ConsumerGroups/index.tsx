import React, { useEffect, useState } from 'react';
import { getConsumerGroups } from '../../services/queueService';

const ConsumerGroups: React.FC = () => {
    const [consumerGroups, setConsumerGroups] = useState([]);

    useEffect(() => {
        const fetchConsumerGroups = async () => {
            const groups = await getConsumerGroups();
            setConsumerGroups(groups);
        };

        fetchConsumerGroups();
    }, []);

    return (
        <div>
            <h2>Consumer Groups</h2>
            <ul>
                {consumerGroups.map((group) => (
                    <li key={group.id}>{group.name}</li>
                ))}
            </ul>
        </div>
    );
};

export default ConsumerGroups;