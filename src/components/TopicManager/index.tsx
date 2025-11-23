import React, { useEffect, useState } from 'react';
import { createTopic, deleteTopic, fetchTopics, updateTopic } from '../../services/queueService';
import { Topic } from '../../types';

const TopicManager: React.FC = () => {
    const [topics, setTopics] = useState<Topic[]>([]);
    const [newTopicName, setNewTopicName] = useState<string>('');
    const [editingTopic, setEditingTopic] = useState<Topic | null>(null);

    useEffect(() => {
        const loadTopics = async () => {
            const fetchedTopics = await fetchTopics();
            setTopics(fetchedTopics);
        };
        loadTopics();
    }, []);

    const handleCreateTopic = async () => {
        if (newTopicName) {
            const createdTopic = await createTopic(newTopicName);
            setTopics([...topics, createdTopic]);
            setNewTopicName('');
        }
    };

    const handleUpdateTopic = async () => {
        if (editingTopic) {
            const updatedTopic = await updateTopic(editingTopic.id, editingTopic.name);
            setTopics(topics.map(topic => (topic.id === updatedTopic.id ? updatedTopic : topic)));
            setEditingTopic(null);
        }
    };

    const handleDeleteTopic = async (id: string) => {
        await deleteTopic(id);
        setTopics(topics.filter(topic => topic.id !== id));
    };

    return (
        <div>
            <h2>Topic Manager</h2>
            <input
                type="text"
                value={newTopicName}
                onChange={(e) => setNewTopicName(e.target.value)}
                placeholder="New Topic Name"
            />
            <button onClick={handleCreateTopic}>Create Topic</button>

            <ul>
                {topics.map(topic => (
                    <li key={topic.id}>
                        {editingTopic?.id === topic.id ? (
                            <input
                                type="text"
                                value={editingTopic.name}
                                onChange={(e) => setEditingTopic({ ...editingTopic, name: e.target.value })}
                            />
                        ) : (
                            <span>{topic.name}</span>
                        )}
                        <button onClick={() => setEditingTopic(topic)}>Edit</button>
                        <button onClick={() => handleDeleteTopic(topic.id)}>Delete</button>
                        {editingTopic?.id === topic.id && (
                            <button onClick={handleUpdateTopic}>Save</button>
                        )}
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default TopicManager;