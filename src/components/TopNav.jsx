import React, { useState, useRef, useEffect } from 'react';
import { Home, Grid, Wrench, User, Bell, Settings, ChevronDown, Menu, LogOut, Shield, GraduationCap } from 'lucide-react';
import { useAppContext } from '../context/AppContext';
import './TopNav.css';

const TopNav = ({ currentView, onViewChange, onMenuToggle, onLogout }) => {
  const { currentUser } = useAppContext();
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const profileRef = useRef(null);

  // Close menu on outside click
  useEffect(() => {
    const handleClick = (e) => {
      if (profileRef.current && !profileRef.current.contains(e.target)) {
        setShowProfileMenu(false);
      }
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  const isProfesor = currentUser?.role === 'profesor';
  const initials = currentUser?.name
    ? currentUser.name.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase()
    : 'U';

  return (
    <header className="topnav">
      <div className="topnav-left">
        <button className="menu-toggle-btn" onClick={onMenuToggle} aria-label="Toggle Menu">
          <Menu size={24} />
        </button>
        <nav className="top-menu">
          <button 
            className={`top-menu-item active`}
            onClick={() => onViewChange('dashboard')}
          >
            <Grid size={18} />
            <span className="hide-on-mobile">Mis Clases</span>
          </button>
        </nav>
      </div>

      <div className="topnav-right">
        {/* Role badge */}
        <div className={`role-badge ${isProfesor ? 'role-profesor' : 'role-alumno'}`}>
          {isProfesor ? <Shield size={14} /> : <GraduationCap size={14} />}
          <span className="hide-on-mobile">{isProfesor ? 'Profesor' : 'Alumno'}</span>
        </div>

        {/* Profile dropdown */}
        <div className="profile-dropdown-wrapper" ref={profileRef}>
          <button
            className="profile-btn"
            onClick={() => setShowProfileMenu(!showProfileMenu)}
          >
            <div className="profile-avatar">
              <span>{initials}</span>
            </div>
            <span className="hide-on-mobile profile-name">{currentUser?.name || 'Usuario'}</span>
            <ChevronDown size={14} className={`hide-on-mobile chevron ${showProfileMenu ? 'rotated' : ''}`} />
          </button>

          {showProfileMenu && (
            <div className="profile-menu">
              <div className="profile-menu-header">
                <div className="profile-menu-avatar">
                  <span>{initials}</span>
                </div>
                <div className="profile-menu-info">
                  <span className="profile-menu-name">{currentUser?.name}</span>
                  <span className="profile-menu-email">{currentUser?.email}</span>
                </div>
              </div>
              <div className="profile-menu-divider"></div>
              <button className="profile-menu-item" onClick={() => setShowProfileMenu(false)}>
                <User size={16} />
                <span>Mi perfil</span>
              </button>
              <button className="profile-menu-item" onClick={() => setShowProfileMenu(false)}>
                <Settings size={16} />
                <span>Configuración</span>
              </button>
              <div className="profile-menu-divider"></div>
              <button className="profile-menu-item logout-item" onClick={() => { setShowProfileMenu(false); onLogout(); }}>
                <LogOut size={16} />
                <span>Cerrar sesión</span>
              </button>
            </div>
          )}
        </div>

        <button className="icon-btn">
          <Bell size={18} />
          <span className="notification-dot"></span>
        </button>
      </div>
    </header>
  );
};

export default TopNav;
