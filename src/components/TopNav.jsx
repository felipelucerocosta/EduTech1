import React from 'react';
import { Home, Grid, Wrench, User, Bell, Settings, ChevronDown, Menu } from 'lucide-react';
import './TopNav.css';

const TopNav = ({ currentView, onViewChange, onMenuToggle }) => {
  return (
    <header className="topnav">
      <div className="topnav-left">
        <button className="menu-toggle-btn" onClick={onMenuToggle} aria-label="Toggle Menu">
          <Menu size={24} />
        </button>
        <nav className="top-menu">
          <button 
            className={`top-menu-item ${currentView !== 'dashboard' && currentView !== 'classView' ? 'active' : ''}`}
            onClick={() => onViewChange('dashboard')}
          >
            <Home size={18} />
            <span className="hide-on-mobile">Inicio</span>
          </button>
          <button 
            className={`top-menu-item active`}
            onClick={() => onViewChange('dashboard')}
          >
            <Grid size={18} />
            <span className="hide-on-mobile">Mis Clases</span>
          </button>
          <button className="top-menu-item hide-on-mobile">
            <Wrench size={18} />
            <span>Herramientas</span>
          </button>
        </nav>
      </div>

      <div className="topnav-right">
        <button className="profile-btn">
          <User size={18} />
          <span className="hide-on-mobile">Perfil</span>
          <ChevronDown size={14} className="hide-on-mobile" />
        </button>
        <button className="icon-btn">
          <Bell size={18} />
          <span className="notification-dot"></span>
        </button>
        <button className="icon-btn hide-on-mobile">
          <Settings size={18} />
        </button>
      </div>
    </header>
  );
};

export default TopNav;
