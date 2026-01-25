import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Header from './components/Header';
import QueueList from './components/QueueList';
import QueueDetails from './components/QueueDetails';
import MessageViewer from './components/MessageViewer';

const AppLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    return (
        <div className="app-layout">
            <Header />
            <main className="app-main">
                {children}
            </main>
        </div>
    );
};

const App: React.FC = () => (
    <BrowserRouter>
        <AppLayout>
            <Routes>
                <Route path="/" element={<QueueList />} />
                <Route path="/queues/:queueId" element={<QueueDetails />} />
                <Route path="/queues/:queueId/messages" element={<MessageViewer />} />
                <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
        </AppLayout>
    </BrowserRouter>
);

export default App;
