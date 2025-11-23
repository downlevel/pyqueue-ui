import axios, { type AxiosRequestConfig } from 'axios';
import type { Message, Queue, QueueCollection } from '../types';

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
        const candidates = ['items', 'data', 'records', 'results', 'queues', 'messages'];

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

type RawQueue = {
    queue_name?: unknown;
    queueName?: unknown;
    name?: unknown;
    id?: unknown;
    message_count?: unknown;
    messageCount?: unknown;
    available_messages?: unknown;
    availableMessages?: unknown;
    in_flight_messages?: unknown;
    inFlightMessages?: unknown;
    permissions?: unknown;
};

type RawQueuesEnvelope = {
    queues?: RawQueue[];
    count?: unknown;
    api_key_description?: unknown;
    apiKeyDescription?: unknown;
};

const toNumber = (value: unknown, fallback = 0): number => {
    if (typeof value === 'number') {
        return Number.isFinite(value) ? value : fallback;
    }

    if (typeof value === 'string' && value.trim().length > 0) {
        const parsed = Number(value);
        return Number.isFinite(parsed) ? parsed : fallback;
    }

    return fallback;
};

const toStringValue = (value: unknown, fallback = ''): string => {
    if (typeof value === 'string') {
        return value;
    }

    if (typeof value === 'number' || typeof value === 'boolean') {
        return String(value);
    }

    return fallback;
};

const toStringArray = (value: unknown): string[] =>
    Array.isArray(value) ? value.map((item) => toStringValue(item)).filter(Boolean) : [];

const mapQueue = (raw: RawQueue, index: number): Queue => {
    const queueName = toStringValue(
        raw.queue_name ?? raw.queueName ?? raw.name ?? raw.id,
        `queue-${index + 1}`
    );

    const available = toNumber(raw.available_messages ?? raw.availableMessages);
    const inFlight = toNumber(raw.in_flight_messages ?? raw.inFlightMessages);
    const total = toNumber(raw.message_count ?? raw.messageCount, available + inFlight);

    return {
        id: queueName,
        queueName,
        messageCount: total,
        availableMessages: available,
        inFlightMessages: inFlight,
        permissions: toStringArray(raw.permissions)
    };
};

const normaliseQueuesPayload = (payload: unknown): QueueCollection => {
    const envelope: RawQueuesEnvelope | undefined =
        payload && typeof payload === 'object' ? (payload as RawQueuesEnvelope) : undefined;

    const rawQueues = Array.isArray(envelope?.queues)
        ? (envelope?.queues as RawQueue[])
        : ensureArray<RawQueue>(payload);

    const queues = rawQueues.map((raw, index) => mapQueue(raw, index));

    const count = toNumber(envelope?.count, queues.length);

    const apiKeyDescriptionCandidate =
        envelope?.api_key_description ?? (envelope as Record<string, unknown> | undefined)?.apiKeyDescription;

    const apiKeyDescription =
        typeof apiKeyDescriptionCandidate === 'string' ? apiKeyDescriptionCandidate : undefined;

    return {
        queues,
        count,
        apiKeyDescription
    };
};

const findQueueByName = (queues: Queue[], queueName: string): Queue | undefined =>
    queues.find((queue) => queue.queueName === queueName || queue.id === queueName);

export const getQueues = async (): Promise<QueueCollection> => {
    const payload = await request<unknown>({ method: 'GET', url: '/queues' });
    return normaliseQueuesPayload(payload);
};

export const getQueueDetails = async (queueId: string): Promise<Queue> => {
    const payload = await request<unknown>({ method: 'GET', url: `/queues/${queueId}/info` });

    if (payload && typeof payload === 'object') {
        const envelope = payload as RawQueuesEnvelope & { queue?: RawQueue };

        if (envelope.queue) {
            return mapQueue(envelope.queue, 0);
        }

        if (Array.isArray(envelope.queues)) {
            const { queues } = normaliseQueuesPayload(envelope);
            return findQueueByName(queues, queueId) ?? queues[0];
        }
    }

    if (Array.isArray(payload)) {
        const { queues } = normaliseQueuesPayload(payload);
        return findQueueByName(queues, queueId) ?? queues[0];
    }

    return mapQueue((payload as RawQueue) ?? { queue_name: queueId }, 0);
};

export const getQueueMessages = async (queueId: string): Promise<Message[]> => {
    const encodedId = encodeURIComponent(queueId);
    const payload = await request<unknown>({ method: 'GET', url: `/queues/${encodedId}/messages` });
    return ensureArray<Message>(payload);
};

export interface CreateQueuePayload {
    name: string;
    description?: string;
}

export const createQueue = async (payload: CreateQueuePayload): Promise<Queue> => {
    const response = await request<unknown>({ method: 'POST', url: '/queues', data: payload });

    if (response && typeof response === 'object') {
        const envelope = response as RawQueuesEnvelope & { queue?: RawQueue };
        if (envelope.queue) {
            return mapQueue(envelope.queue, 0);
        }

        if (Array.isArray(envelope.queues)) {
            const { queues } = normaliseQueuesPayload(envelope);
            return queues[0];
        }
    }

    return mapQueue((response as RawQueue) ?? { queue_name: payload.name }, 0);
};

export const deleteQueue = async (queueId: string): Promise<void> => {
    const encodedId = encodeURIComponent(queueId);
    await request<void>({ method: 'DELETE', url: `/queues/${encodedId}` });
};
