import React, { useState, useCallback } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import QueueList from './components/QueueList';
import QueueDetails from './components/QueueDetails';
import MessageViewer from './components/MessageViewer';

const AppLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [sidebarOpen, setSidebarOpen] = useState(false);

    const handleMenuClick = useCallback(() => {
        setSidebarOpen((prev) => !prev);
    }, []);

    const handleSidebarClose = useCallback(() => {
        setSidebarOpen(false);
    }, []);

    return (
        <div className="app-layout">
            <Sidebar isOpen={sidebarOpen} onClose={handleSidebarClose} />
            <div className="main-content">
                <Header onMenuClick={handleMenuClick} />
                <main className="app-main">
                    {children}
                </main>
            </div>
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
