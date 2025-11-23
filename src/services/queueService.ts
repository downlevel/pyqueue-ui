import axios, { type AxiosRequestConfig } from 'axios';
import type { ConsumerGroup, Message, Queue, Topic } from '../types';

const API_BASE_URL = import.meta.env.VITE_API_URL ?? '/api';

const client = axios.create({
    baseURL: API_BASE_URL,
    timeout: 12_000
});

const request = async <T>(config: AxiosRequestConfig): Promise<T> => {
    try {
        const { data } = await client.request<T>(config);
        return data;
    } catch (error) {
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

export const getQueues = async (): Promise<Queue[]> =>
    request<Queue[]>({ method: 'GET', url: '/queues' });

export const getQueueDetails = async (queueId: string): Promise<Queue> =>
    request<Queue>({ method: 'GET', url: `/queues/${queueId}` });

export const getQueueMessages = async (queueId: string): Promise<Message[]> =>
    request<Message[]>({ method: 'GET', url: `/queues/${queueId}/messages` });

export interface CreateQueuePayload {
    name: string;
    description?: string;
}

export const createQueue = async (payload: CreateQueuePayload): Promise<Queue> =>
    request<Queue>({ method: 'POST', url: '/queues', data: payload });

export const deleteQueue = async (queueId: string): Promise<void> => {
    await request<void>({ method: 'DELETE', url: `/queues/${queueId}` });
};

export const getTopics = async (): Promise<Topic[]> =>
    request<Topic[]>({ method: 'GET', url: '/topics' });

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

export const getConsumerGroups = async (): Promise<ConsumerGroup[]> =>
    request<ConsumerGroup[]>({ method: 'GET', url: '/consumer-groups' });