import React from 'react';
import { BrowserRouter, Routes, Route, Navigate, Link } from 'react-router-dom';
import QueueList from './components/QueueList';
import QueueDetails from './components/QueueDetails';
import MessageViewer from './components/MessageViewer';
import TopicManager from './components/TopicManager';
import ConsumerGroups from './components/ConsumerGroups';

const App: React.FC = () => (
  <BrowserRouter>
    <div className="app-container">
      <header className="app-header">
        <h1>PyQueue UI</h1>
        <nav className="nav-links">
          <Link to="/">Queues</Link>
          <Link to="/topics">Topics</Link>
          <Link to="/consumer-groups">Consumer Groups</Link>
        </nav>
      </header>
      <main className="app-main">
        <Routes>
          <Route path="/" element={<QueueList />} />
          <Route path="/queues/:queueId" element={<QueueDetails />} />
          <Route path="/queues/:queueId/messages" element={<MessageViewer />} />
          <Route path="/topics" element={<TopicManager />} />
          <Route path="/consumer-groups" element={<ConsumerGroups />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
    </div>
  </BrowserRouter>
);

export default App;