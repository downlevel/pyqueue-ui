import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import QueueList from './components/QueueList';
import QueueDetails from './components/QueueDetails';
import MessageViewer from './components/MessageViewer';
import TopicManager from './components/TopicManager';
import ConsumerGroups from './components/ConsumerGroups';
import './styles/index.css';

const App: React.FC = () => {
  return (
    <Router>
      <div className="app-container">
        <Switch>
          <Route path="/" exact component={QueueList} />
          <Route path="/queues/:id" component={QueueDetails} />
          <Route path="/messages/:id" component={MessageViewer} />
          <Route path="/topics" component={TopicManager} />
          <Route path="/consumer-groups" component={ConsumerGroups} />
        </Switch>
      </div>
    </Router>
  );
};

export default App;