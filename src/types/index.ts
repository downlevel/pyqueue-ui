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
    content: string;
    timestamp: string;
    queueId: string;
}