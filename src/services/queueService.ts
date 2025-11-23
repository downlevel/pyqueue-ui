import axios, { type AxiosRequestConfig } from 'axios';
import type { ConsumerGroup, Message, Queue, Topic } from '../types';

const API_BASE_URL = import.meta.env.VITE_API_URL ?? '/api';
const API_KEY = import.meta.env.VITE_API_KEY;

const client = axios.create({
    baseURL: API_BASE_URL,
    timeout: 12_000
});

if (API_KEY) {
    client.defaults.headers.common['x-api-key'] = API_KEY;
}

const request = async <T>(config: AxiosRequestConfig): Promise<T> => {
    try {
        const { data } = await client.request<T>(config);
        return data;
    } catch (error: unknown) {
        if (axios.isAxiosError(error)) {
            const message =
                (error.response?.data as { message?: string } | undefined)?.message ??
                error.message ??
                'Request failed.';
            throw new Error(message);
        }

        if (error instanceof Error) {
            throw error;
        }

        throw new Error('Unknown error occurred.');
    }
};

const ensureArray = <T>(payload: unknown): T[] => {
    if (Array.isArray(payload)) {
        return payload as T[];
    }

    if (payload && typeof payload === 'object') {
        const candidates = ['items', 'data', 'records', 'results', 'queues', 'topics', 'messages'];

        for (const key of candidates) {
            const value = (payload as Record<string, unknown>)[key];
            if (Array.isArray(value)) {
                return value as T[];
            }
        }

        const firstArray = Object.values(payload as Record<string, unknown>).find(Array.isArray);
        if (Array.isArray(firstArray)) {
            return firstArray as T[];
        }
    }

    return [];
};

export const getQueues = async (): Promise<Queue[]> => {
    const payload = await request<unknown>({ method: 'GET', url: '/queues' });
    return ensureArray<Queue>(payload);
};

export const getQueueDetails = async (queueId: string): Promise<Queue> =>
    request<Queue>({ method: 'GET', url: `/queues/${queueId}` });

export const getQueueMessages = async (queueId: string): Promise<Message[]> => {
    const payload = await request<unknown>({ method: 'GET', url: `/queues/${queueId}/messages` });
    return ensureArray<Message>(payload);
};

export interface CreateQueuePayload {
    name: string;
    description?: string;
}

export const createQueue = async (payload: CreateQueuePayload): Promise<Queue> =>
    request<Queue>({ method: 'POST', url: '/queues', data: payload });

export const deleteQueue = async (queueId: string): Promise<void> => {
    await request<void>({ method: 'DELETE', url: `/queues/${queueId}` });
};

export const getTopics = async (): Promise<Topic[]> => {
    const payload = await request<unknown>({ method: 'GET', url: '/topics' });
    return ensureArray<Topic>(payload);
};

export interface CreateTopicPayload {
    name: string;
    partitions?: number;
    replicationFactor?: number;
}

export const createTopic = async (payload: CreateTopicPayload): Promise<Topic> =>
    request<Topic>({ method: 'POST', url: '/topics', data: payload });

export const updateTopic = async (
    topicId: string,
    payload: Partial<CreateTopicPayload>
): Promise<Topic> =>
    request<Topic>({ method: 'PUT', url: `/topics/${topicId}`, data: payload });

export const deleteTopic = async (topicId: string): Promise<void> => {
    await request<void>({ method: 'DELETE', url: `/topics/${topicId}` });
};

export const getConsumerGroups = async (): Promise<ConsumerGroup[]> => {
    const payload = await request<unknown>({ method: 'GET', url: '/consumer-groups' });
    return ensureArray<ConsumerGroup>(payload);
};