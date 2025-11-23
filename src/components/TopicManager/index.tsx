import React, { useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
    createTopic,
    deleteTopic,
    getTopics,
    updateTopic,
    type CreateTopicPayload
} from '../../services/queueService';
import type { Topic } from '../../types';

const TopicManager: React.FC = () => {
    const queryClient = useQueryClient();
    const [form, setForm] = useState<CreateTopicPayload>({
        name: '',
        partitions: 1,
        replicationFactor: 1
    });
    const [editingTopicId, setEditingTopicId] = useState<string | null>(null);
    const [editingName, setEditingName] = useState<string>('');

    const topicsQuery = useQuery<Topic[], Error>({
        queryKey: ['topics'],
        queryFn: getTopics
    });

    const createTopicMutation = useMutation({
        mutationFn: (payload: CreateTopicPayload) => createTopic(payload),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['topics'] });
            setForm({ name: '', partitions: 1, replicationFactor: 1 });
        }
    });

    const updateTopicMutation = useMutation({
        mutationFn: ({ id, payload }: { id: string; payload: Partial<CreateTopicPayload> }) =>
            updateTopic(id, payload),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['topics'] });
            setEditingTopicId(null);
            setEditingName('');
        }
    });

    const deleteTopicMutation = useMutation({
        mutationFn: (id: string) => deleteTopic(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['topics'] });
        }
    });

    const handleCreateTopic = () => {
        if (!form.name.trim()) {
            return;
        }

        createTopicMutation.mutate({
            name: form.name.trim(),
            partitions: form.partitions,
            replicationFactor: form.replicationFactor
        });
    };

    const startEditing = (topic: Topic) => {
        setEditingTopicId(topic.id);
        setEditingName(topic.name);
    };

    const handleSaveTopic = () => {
        if (!editingTopicId) {
            return;
        }

        updateTopicMutation.mutate({
            id: editingTopicId,
            payload: { name: editingName.trim() }
        });
    };

    const topics = topicsQuery.data ?? [];

    return (
        <section className="card topic-manager">
            <h2>Topic Manager</h2>

            <div className="topic-form">
                <input
                    type="text"
                    value={form.name}
                    onChange={(event) => setForm((current) => ({ ...current, name: event.target.value }))}
                    placeholder="Topic name"
                />
                <input
                    type="number"
                    min={1}
                    value={form.partitions ?? ''}
                    onChange={(event) =>
                        setForm((current) => ({
                            ...current,
                            partitions: Number(event.target.value) || 1
                        }))
                    }
                    placeholder="Partitions"
                />
                <input
                    type="number"
                    min={1}
                    value={form.replicationFactor ?? ''}
                    onChange={(event) =>
                        setForm((current) => ({
                            ...current,
                            replicationFactor: Number(event.target.value) || 1
                        }))
                    }
                    placeholder="Replication factor"
                />
                <button
                    className="button"
                    type="button"
                    onClick={handleCreateTopic}
                    disabled={createTopicMutation.isPending}
                >
                    {createTopicMutation.isPending ? 'Creating…' : 'Create topic'}
                </button>
            </div>

            {topicsQuery.isLoading && <div className="status-card">Loading topics…</div>}
            {topicsQuery.isError && <div className="status-card error">{topicsQuery.error.message}</div>}

            {!topicsQuery.isLoading && !topicsQuery.isError && topics.length === 0 && (
                <div className="status-card">No topics found.</div>
            )}

            {topics.length > 0 && (
                <ul className="topic-list">
                    {topics.map((topic) => (
                        <li key={topic.id} className="topic-item">
                            {editingTopicId === topic.id ? (
                                <input
                                    type="text"
                                    value={editingName}
                                    onChange={(event) => setEditingName(event.target.value)}
                                />
                            ) : (
                                <div>
                                    <h3>{topic.name}</h3>
                                    <p>Partitions: {topic.partitions ?? 'n/a'}</p>
                                    <p>Replication factor: {topic.replicationFactor ?? 'n/a'}</p>
                                </div>
                            )}

                            <div className="actions">
                                {editingTopicId === topic.id ? (
                                    <>
                                        <button
                                            className="button"
                                            type="button"
                                            onClick={handleSaveTopic}
                                            disabled={updateTopicMutation.isPending}
                                        >
                                            {updateTopicMutation.isPending ? 'Saving…' : 'Save'}
                                        </button>
                                        <button
                                            className="button secondary"
                                            type="button"
                                            onClick={() => setEditingTopicId(null)}
                                        >
                                            Cancel
                                        </button>
                                    </>
                                ) : (
                                    <button className="button" type="button" onClick={() => startEditing(topic)}>
                                        Edit
                                    </button>
                                )}
                                <button
                                    className="button danger"
                                    type="button"
                                    onClick={() => deleteTopicMutation.mutate(topic.id)}
                                    disabled={deleteTopicMutation.isPending}
                                >
                                    Delete
                                </button>
                            </div>
                        </li>
                    ))}
                </ul>
            )}

            {(createTopicMutation.isError || updateTopicMutation.isError || deleteTopicMutation.isError) && (
                <div className="status-card error">
                    {(createTopicMutation.error || updateTopicMutation.error || deleteTopicMutation.error)?.message ??
                        'Topic operation failed.'}
                </div>
            )}
        </section>
    );
};

export default TopicManager;