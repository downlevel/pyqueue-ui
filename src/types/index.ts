export interface Queue {
    id: string;
    queueName: string;
    messageCount: number;
    availableMessages: number;
    inFlightMessages: number;
    permissions: string[];
}

export interface QueueCollection {
    queues: Queue[];
    count: number;
    apiKeyDescription?: string;
}

export interface Message {
    id: string;
    timestamp: string;
    status?: string;
    visibilityTimeout?: string | null;
    receiptHandle?: string | null;
    receiveCount?: number;
    messageBody: unknown;
    queueId?: string;
    raw?: Record<string, unknown>;
}

export interface MessagePage {
    messages: Message[];
    count: number;
    total: number;
    offset: number;
    limit: number;
    hasMore: boolean;
}