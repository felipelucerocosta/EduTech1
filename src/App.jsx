import React, { useState } from 'react';
import './App.css';
import { AppProvider, useAppContext } from './context/AppContext';
import Login from './components/Login';
import Layout from './components/Layout';
import Dashboard from './components/Dashboard';
import ClassView from './components/ClassView';

import Deliveries from './components/Deliveries';
import Resources from './components/Resources';
import Support from './components/Support';

function AppInner() {
  const { currentUser, logout } = useAppContext();
  const [currentView, setCurrentView] = useState('login');

  const handleLogout = () => {
    logout();
    setCurrentView('login');
  };

  const renderView = () => {
    if (currentView === 'login') {
      return <Login onLogin={() => setCurrentView('dashboard')} />;
    }

    return (
      <Layout currentView={currentView} onViewChange={setCurrentView} onLogout={handleLogout}>
        {currentView === 'dashboard' && <Dashboard onViewClass={() => setCurrentView('classView')} />}
        {currentView === 'classView' && <ClassView />}
        {currentView === 'entregas' && <Deliveries />}
        {currentView === 'recursos' && <Resources />}
        {currentView === 'soporte' && <Support />}
      </Layout>
    );
  };

  return (
    <div className="app-container">
      {renderView()}
    </div>
  );
}

function App() {
  return (
    <AppProvider>
      <AppInner />
    </AppProvider>
  );
}

export default App;
