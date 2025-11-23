import React from 'react';

interface MessageViewerProps {
    message: {
        id: string;
        content: string;
        timestamp: string;
    };
}

const MessageViewer: React.FC<MessageViewerProps> = ({ message }) => {
    return (
        <div className="message-viewer">
            <h2>Message Details</h2>
            <p><strong>ID:</strong> {message.id}</p>
            <p><strong>Content:</strong> {message.content}</p>
            <p><strong>Timestamp:</strong> {message.timestamp}</p>
        </div>
    );
};

export default MessageViewer;