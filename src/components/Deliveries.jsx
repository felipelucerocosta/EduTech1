import React from 'react';
import { Calendar, CheckCircle2, Clock, AlertCircle } from 'lucide-react';
import './Deliveries.css';

const Deliveries = () => {
  const tasks = [
    {
      id: 1,
      title: 'Plano de Instalación Eléctrica - Nave A',
      subject: 'Instalaciones Eléctricas',
      dueDate: '15 de Octubre',
      status: 'pending',
      priority: 'high',
      icon: '⚡'
    },
    {
      id: 2,
      title: 'Informe de Resistencia de Materiales',
      subject: 'Mecánica Técnica',
      dueDate: '18 de Octubre',
      status: 'in-progress',
      priority: 'medium',
      icon: '⚙️'
    },
    {
      id: 3,
      title: 'Cómputo y Presupuesto de Obra',
      subject: 'Gestión de Obra',
      dueDate: '12 de Octubre',
      status: 'completed',
      priority: 'low',
      icon: '📊'
    }
  ];

  const getStatusIcon = (status) => {
    switch (status) {
      case 'completed': return <CheckCircle2 size={18} className="status-completed" />;
      case 'in-progress': return <Clock size={18} className="status-progress" />;
      case 'pending': return <AlertCircle size={18} className="status-pending" />;
      default: return null;
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'completed': return 'Completado';
      case 'in-progress': return 'En Progreso';
      case 'pending': return 'Pendiente';
      default: return '';
    }
  };

  return (
    <div className="deliveries-container">
      <div className="deliveries-header">
        <h1 className="page-title">Próximas Entregas</h1>
        <div className="title-divider"></div>
        <p className="page-subtitle">Gestiona tus proyectos y entregas técnicas pendientes</p>
      </div>

      <div className="tasks-list">
        {tasks.map((task) => (
          <div key={task.id} className={`task-card ${task.status}`}>
            <div className="task-content">
              <div className="task-icon-box">
                <span className="task-emoji">{task.icon}</span>
              </div>
              <div className="task-info">
                <div className="task-top">
                  <span className="task-subject">{task.subject}</span>
                  <div className={`priority-tag ${task.priority}`}>
                    {task.priority === 'high' ? 'Crítico' : task.priority === 'medium' ? 'Importante' : 'Normal'}
                  </div>
                </div>
                <h3 className="task-title">{task.title}</h3>
                <div className="task-meta">
                  <div className="meta-item">
                    <Calendar size={14} />
                    <span>Entrega: {task.dueDate}</span>
                  </div>
                  <div className="meta-item status">
                    {getStatusIcon(task.status)}
                    <span>{getStatusText(task.status)}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Deliveries;
