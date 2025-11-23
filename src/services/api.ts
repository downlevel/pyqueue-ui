import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000/api'; // Adjust the base URL as needed

// Function to get the list of queues
export const getQueues = async () => {
    try {
        const response = await axios.get(`${API_BASE_URL}/queues`);
        return response.data;
    } catch (error) {
        throw new Error('Error fetching queues: ' + error.message);
    }
};

// Function to get details of a specific queue
export const getQueueDetails = async (queueId) => {
    try {
        const response = await axios.get(`${API_BASE_URL}/queues/${queueId}`);
        return response.data;
    } catch (error) {
        throw new Error('Error fetching queue details: ' + error.message);
    }
};

// Function to get messages from a specific queue
export const getMessages = async (queueId) => {
    try {
        const response = await axios.get(`${API_BASE_URL}/queues/${queueId}/messages`);
        return response.data;
    } catch (error) {
        throw new Error('Error fetching messages: ' + error.message);
    }
};

// Function to create a new queue
export const createQueue = async (queueData) => {
    try {
        const response = await axios.post(`${API_BASE_URL}/queues`, queueData);
        return response.data;
    } catch (error) {
        throw new Error('Error creating queue: ' + error.message);
    }
};

// Function to delete a queue
export const deleteQueue = async (queueId) => {
    try {
        await axios.delete(`${API_BASE_URL}/queues/${queueId}`);
    } catch (error) {
        throw new Error('Error deleting queue: ' + error.message);
    }
};