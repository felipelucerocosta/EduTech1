import React from 'react';
import { Calendar, CheckCircle2, Clock, AlertCircle, Inbox } from 'lucide-react';
import { useAppContext } from '../context/AppContext';
import './Deliveries.css';

const Deliveries = () => {
  const { tasks } = useAppContext();

  const getStatusIcon = (status) => {
    switch (status) {
      case 'completed': return <CheckCircle2 size={18} className="status-completed" />;
      case 'in-progress': return <Clock size={18} className="status-progress" />;
      case 'pending': return <AlertCircle size={18} className="status-pending" />;
      default: return <AlertCircle size={18} className="status-pending" />;
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'completed': return 'Completado';
      case 'in-progress': return 'En Progreso';
      case 'pending': return 'Pendiente';
      default: return 'Pendiente';
    }
  };

  return (
    <div className="deliveries-container animate-fade-in">
      <div className="deliveries-header">
        <h1 className="page-title">Próximas Entregas</h1>
        <div className="title-divider"></div>
        <p className="page-subtitle">Gestiona tus proyectos y entregas técnicas pendientes</p>
      </div>

      <div className="tasks-list">
        {tasks.length === 0 ? (
          <div className="empty-state" style={{marginTop: '40px'}}>
            <Inbox size={48} color="var(--text-dim)" style={{marginBottom: '16px'}} />
            <h3>No hay entregas pendientes</h3>
            <p className="page-subtitle">Las tareas aparecerán cuando un profesor las asigne.</p>
          </div>
        ) : (
          tasks.map((task) => (
            <div key={task.id} className={`task-card ${task.status || 'pending'}`}>
              <div className="task-content">
                <div className="task-icon-box">
                  <span className="task-emoji">{task.icon || '📝'}</span>
                </div>
                <div className="task-info">
                  <div className="task-top">
                    <span className="task-subject">{task.subject}</span>
                    <div className={`priority-tag ${task.priority || 'medium'}`}>
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
          ))
        )}
      </div>
    </div>
  );
};

export default Deliveries;
