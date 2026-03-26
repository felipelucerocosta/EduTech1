import React, { useState } from 'react';
import Sidebar from './Sidebar';
import TopNav from './TopNav';
import './Layout.css';

const Layout = ({ children, currentView, onViewChange }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleViewChange = (view) => {
    onViewChange(view);
    setIsMobileMenuOpen(false); // Close sidebar on navigation in mobile
  };

  return (
    <div className="layout-container">
      {/* Overlay for mobile sidebar */}
      {isMobileMenuOpen && (
        <div className="mobile-overlay" onClick={() => setIsMobileMenuOpen(false)}></div>
      )}
      <div className={`sidebar-wrapper ${isMobileMenuOpen ? 'open' : ''}`}>
        <Sidebar activeItem={currentView === 'dashboard' || currentView === 'classView' ? 'dashboard' : ''} />
      </div>
      <div className="layout-main">
        <TopNav 
          currentView={currentView} 
          onViewChange={handleViewChange} 
          onMenuToggle={() => setIsMobileMenuOpen(!isMobileMenuOpen)} 
        />
        <div className="layout-content-scrollable">
          {children}
        </div>
      </div>
    </div>
  );
};

export default Layout;
