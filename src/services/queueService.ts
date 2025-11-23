import axios from 'axios';
import { Queue, Topic, Message } from '../types';

const API_BASE_URL = 'http://localhost:5000/api'; // Adjust the base URL as needed

export const fetchQueues = async (): Promise<Queue[]> => {
    const response = await axios.get(`${API_BASE_URL}/queues`);
    return response.data;
};

export const fetchQueueDetails = async (queueId: string): Promise<Queue> => {
    const response = await axios.get(`${API_BASE_URL}/queues/${queueId}`);
    return response.data;
};

export const fetchMessages = async (queueId: string): Promise<Message[]> => {
    const response = await axios.get(`${API_BASE_URL}/queues/${queueId}/messages`);
    return response.data;
};

export const createTopic = async (topic: Topic): Promise<Topic> => {
    const response = await axios.post(`${API_BASE_URL}/topics`, topic);
    return response.data;
};

export const deleteTopic = async (topicId: string): Promise<void> => {
    await axios.delete(`${API_BASE_URL}/topics/${topicId}`);
};