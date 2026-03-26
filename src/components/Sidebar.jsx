import React from 'react';
import { LayoutDashboard, CalendarDays, FolderOpen, HelpCircle } from 'lucide-react';
import './Sidebar.css';

const Sidebar = ({ activeItem = 'dashboard' }) => {
  const menuItems = [
    { id: 'dashboard', label: 'Panel de Control', icon: LayoutDashboard },
    { id: 'entregas', label: 'Próximas Entregas', icon: CalendarDays },
    { id: 'recursos', label: 'Recursos', icon: FolderOpen },
    { id: 'soporte', label: 'Soporte', icon: HelpCircle },
  ];

  return (
    <div className="sidebar">
      <div className="sidebar-brand">
        <div className="sidebar-logo">
          <span className="logo-text-et" style={{ fontSize: '28px', letterSpacing: '-2px' }}>ET</span>
        </div>
        <span className="brand-name">Global</span>
      </div>

      <nav className="sidebar-nav">
        {menuItems.map((item) => {
          const Icon = item.icon;
          return (
            <a 
              key={item.id}
              href="#"
              className={`nav-item ${activeItem === item.id ? 'active' : ''}`}
            >
              <Icon size={18} strokeWidth={2.5} className="nav-icon" />
              <span>{item.label}</span>
            </a>
          );
        })}
      </nav>
      
      <div className="sidebar-illustration">
        <div className="illustration-box">
          <h4>EduTech Premium</h4>
          <p>Potenciando la educación técnica del futuro.</p>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
