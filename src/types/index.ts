export interface Queue {
    id: string;
    name: string;
    description?: string;
    createdAt?: string;
    updatedAt?: string;
}

export interface Message {
    id: string;
    content: string;
    timestamp: string;
    queueId: string;
}

export interface Topic {
    id: string;
    name: string;
    partitions?: number;
    replicationFactor?: number;
}

export interface ConsumerGroup {
    id: string;
    name: string;
    members: string[];
    queueId: string;
}