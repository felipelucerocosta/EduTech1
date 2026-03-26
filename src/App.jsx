import React, { useState } from 'react';
import './App.css';
import Login from './components/Login';
import Layout from './components/Layout';
import Dashboard from './components/Dashboard';
import ClassView from './components/ClassView';

function App() {
  const [currentView, setCurrentView] = useState('login');

  const renderView = () => {
    switch(currentView) {
      case 'login':
        return <Login onLogin={() => setCurrentView('dashboard')} />;
      case 'dashboard':
        return (
          <Layout currentView={currentView} onViewChange={setCurrentView}>
            <Dashboard onViewClass={() => setCurrentView('classView')} />
          </Layout>
        );
      case 'classView':
        return (
          <Layout currentView={currentView} onViewChange={setCurrentView}>
            <ClassView />
          </Layout>
        );
      default:
        return <Login onLogin={() => setCurrentView('dashboard')} />;
    }
  };

  return (
    <div className="app-container">
      {renderView()}
    </div>
  );
}

export default App;
