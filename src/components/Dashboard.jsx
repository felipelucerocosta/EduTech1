import React from 'react';
import { Plus, Calendar, Users, Cpu, Database, Settings, MessageSquare, FileText } from 'lucide-react';
import './Dashboard.css';

const classes = [
  { id: 1, title: 'Robótica Avanzada', prof: 'Prof. Juan Pérez', tasks: 20, total: 25, users: 0, icon: Settings },
  { id: 2, title: 'Microcontroladores I', prof: 'Prof. Juan Pérez', tasks: 20, total: 25, users: 0, icon: Cpu },
  { id: 3, title: 'Base de Datos Técnicas', prof: 'Prof. Juan Pérez', tasks: 20, total: 25, users: 0, icon: Database },
  { id: 4, title: 'Base de Datos Técnicas', prof: 'Prof. Juan Pérez', tasks: 5, total: 25, users: 0, icon: Database },
  { id: 5, title: 'Robótica Controladores', prof: 'Prof. Juan Pérez', tasks: 10, total: 25, users: 0, icon: Cpu },
  { id: 6, title: 'Circuitos Digitales', prof: 'Prof. Juan Pérez', tasks: 10, total: 25, users: 0, icon: Settings },
];

const Dashboard = ({ onViewClass }) => {
  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <h2 className="page-title">MIS CLASES</h2>
        <div className="header-actions">
          <button className="btn-primary" style={{ padding: '10px 16px', borderRadius: '20px', fontSize: '13px' }}>
            <Plus size={16} style={{ marginRight: '6px' }} />
            UNIRSE A UNA CLASE
          </button>
          <a href="#" className="invitation-link">¿Código de invitación?</a>
        </div>
      </div>

      <div className="classes-grid">
        {classes.map((cls) => {
          const IconComponent = cls.icon;
          const progressPercent = (cls.tasks / cls.total) * 100;
          return (
            <div key={cls.id} className="class-card" onClick={() => onViewClass(cls.id)}>
              <div className="card-content">
                <div className="card-icon-box">
                  <IconComponent size={28} color="white" />
                </div>
                <div className="card-info">
                  <h3 className="class-title">{cls.title}</h3>
                  <p className="class-prof">{cls.prof}</p>
                  
                  <div className="progress-container">
                    <div className="progress-bar-bg">
                      <div className="progress-bar-fill" style={{ width: `${progressPercent}%`, backgroundColor: progressPercent > 50 ? '#0ea5e9' : '#0ea5e9' }}></div>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="card-footer">
                <div className="footer-item">
                  <Calendar size={14} />
                  <span>{cls.tasks}/{cls.total} tareas</span>
                </div>
                <div className="footer-item">
                  <Users size={14} />
                  <span>{cls.users}</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="recent-activity-section">
        <h3 className="section-title">Actividad Reciente</h3>
        <div className="activity-grid">
          
          <div className="activity-item">
            <FileText className="activity-icon text-success" size={20} />
            <div className="activity-details">
              <h4 className="activity-title text-success">Grados grados: 35</h4>
              <p className="activity-subtitle">Grados e grados: S/2</p>
            </div>
          </div>

          <div className="activity-item">
            <MessageSquare className="activity-icon text-muted" size={20} />
            <div className="activity-details">
              <h4 className="activity-title">Forum posta forro controladora</h4>
              <p className="activity-subtitle">Nostas pontas eun recento formendi.</p>
            </div>
          </div>

          <div className="activity-item">
            <MessageSquare className="activity-icon text-muted" size={20} />
            <div className="activity-details">
              <h4 className="activity-title">Forum posta a foro controladora</h4>
              <p className="activity-subtitle">Nostas pontas eun recento formendi.</p>
            </div>
          </div>

          <div className="activity-item">
            <FileText className="activity-icon text-success" size={20} />
            <div className="activity-details">
              <h4 className="activity-title text-success">Grados grada: 25</h4>
              <p className="activity-subtitle">Grades e grados: C/4</p>
            </div>
          </div>

        </div>
        <div className="dashboard-footer">
          Soporte Técnico | Términos y Privacidad | © 2024 Edu-Tech
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
