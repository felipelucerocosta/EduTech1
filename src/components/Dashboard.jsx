import React, { useState } from 'react';
import { Plus, Calendar, Users, BookOpen, Trash2, FileText, MessageSquare } from 'lucide-react';
import { useAppContext } from '../context/AppContext';
import CreateClassModal from './CreateClassModal';
import './Dashboard.css';

// Map subjects to color gradients for visual distinction
const MATERIA_COLORS = {
  'Matemática': 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)',
  'Lengua y Literatura': 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
  'Historia': 'linear-gradient(135deg, #8b5cf6 0%, #6d28d9 100%)',
  'Geografía': 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
  'Física': 'linear-gradient(135deg, #6366f1 0%, #4338ca 100%)',
  'Química': 'linear-gradient(135deg, #ec4899 0%, #be185d 100%)',
  'Biología': 'linear-gradient(135deg, #14b8a6 0%, #0d9488 100%)',
  'Educación Tecnológica': 'linear-gradient(135deg, #f97316 0%, #ea580c 100%)',
  'Robótica': 'linear-gradient(135deg, #38bdf8 0%, #0284c7 100%)',
  'Programación': 'linear-gradient(135deg, #a855f7 0%, #7c3aed 100%)',
  'Base de Datos': 'linear-gradient(135deg, #06b6d4 0%, #0891b2 100%)',
  'Redes y Telecomunicaciones': 'linear-gradient(135deg, #22d3ee 0%, #06b6d4 100%)',
  'Electrónica': 'linear-gradient(135deg, #eab308 0%, #ca8a04 100%)',
  'Electrotecnia': 'linear-gradient(135deg, #f43f5e 0%, #e11d48 100%)',
  'Microcontroladores': 'linear-gradient(135deg, #0ea5e9 0%, #0369a1 100%)',
  'Circuitos Digitales': 'linear-gradient(135deg, #64748b 0%, #475569 100%)',
  'Taller de Mecánica': 'linear-gradient(135deg, #78716c 0%, #57534e 100%)',
  'Taller Eléctrico': 'linear-gradient(135deg, #facc15 0%, #eab308 100%)',
  'Dibujo Técnico': 'linear-gradient(135deg, #fb923c 0%, #ea580c 100%)',
  'Inglés Técnico': 'linear-gradient(135deg, #2dd4bf 0%, #14b8a6 100%)',
  'Educación Física': 'linear-gradient(135deg, #4ade80 0%, #16a34a 100%)',
  'Laboratorio': 'linear-gradient(135deg, #c084fc 0%, #9333ea 100%)',
};

const MATERIA_ICONS = {
  'Matemática': '📐', 'Lengua y Literatura': '📖', 'Historia': '🏛️',
  'Geografía': '🌍', 'Física': '⚛️', 'Química': '🧪',
  'Biología': '🧬', 'Educación Tecnológica': '🔧', 'Robótica': '🤖',
  'Programación': '💻', 'Base de Datos': '🗃️', 'Redes y Telecomunicaciones': '🌐',
  'Electrónica': '🔌', 'Electrotecnia': '⚡', 'Microcontroladores': '🎛️',
  'Circuitos Digitales': '🔲', 'Taller de Mecánica': '🔩', 'Taller Eléctrico': '💡',
  'Dibujo Técnico': '📏', 'Inglés Técnico': '🇬🇧', 'Educación Física': '🏃',
  'Laboratorio': '🔬',
};

const DEFAULT_GRADIENT = 'linear-gradient(135deg, #38bdf8 0%, #3b82f6 100%)';

const Dashboard = ({ onViewClass }) => {
  const { currentUser, classes, deleteClass, tasks, submissions } = useAppContext();
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [deletingId, setDeletingId] = useState(null);

  const isProfesor = currentUser?.role === 'profesor';

  const handleDelete = (e, classId) => {
    e.stopPropagation();
    setDeletingId(classId);
    setTimeout(() => {
      deleteClass(classId);
      setDeletingId(null);
    }, 300);
  };

  const getPendingCount = (classId) => {
    const classTasks = tasks.filter(t => t.classId === classId);
    if (isProfesor) return `${classTasks.length} tareas`;

    const userSubmissions = submissions.filter(
      s => s.classId === classId && s.authorEmail === currentUser?.email
    );
    const pending = classTasks.length - userSubmissions.length;
    return `${pending} pendiente${pending !== 1 ? 's' : ''}`;
  };

  return (
    <div className="dashboard-container animate-fade-in">
      <div className="dashboard-header">
        <div className="header-titles">
          <h2 className="page-title">MIS CLASES</h2>
          <div className="title-divider"></div>
          <p className="page-subtitle">
            {isProfesor
              ? `Gestionando ${classes.length} clase${classes.length !== 1 ? 's' : ''} activas`
              : `Explorando ${classes.length} clase${classes.length !== 1 ? 's' : ''} disponibles`
            }
          </p>
        </div>
        <div className="header-actions">
          {isProfesor ? (
            <button
              className="btn-primary create-class-btn"
              onClick={() => setShowCreateModal(true)}
            >
              <Plus size={18} />
              <span>CREAR NUEVA CLASE</span>
            </button>
          ) : (
            <div className="student-badge-premium">
              <span className="badge-pulse"></span>
              <BookOpen size={16} />
              <span>PANEL ESTUDIANTE</span>
            </div>
          )}
        </div>
      </div>

      {/* Classes grid */}
      {classes.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">📚</div>
          <h3 className="empty-title">
            {isProfesor ? 'No tenés clases creadas aún' : 'No hay clases disponibles'}
          </h3>
          <p className="empty-desc">
            {isProfesor
              ? 'Creá tu primera clase y empezá a organizar tus materias.'
              : 'Esperá a que un profesor cree clases para verlas acá.'
            }
          </p>
          {isProfesor && (
            <button
              className="btn-primary empty-btn"
              onClick={() => setShowCreateModal(true)}
            >
              <Plus size={18} />
              Crear mi primera clase
            </button>
          )}
        </div>
      ) : (
        <div className="classes-grid">
          {classes.map((cls) => {
            const gradient = MATERIA_COLORS[cls.materia] || DEFAULT_GRADIENT;
            const icon = MATERIA_ICONS[cls.materia] || '📘';
            const isDeleting = deletingId === cls.id;
            return (
              <div
                key={cls.id}
                className={`class-card ${isDeleting ? 'card-deleting' : ''}`}
                onClick={() => onViewClass(cls.id)}
              >
                <div className="card-content">
                  <div className="card-icon-box" style={{ background: gradient }}>
                    <span className="card-emoji">{icon}</span>
                  </div>
                  <div className="card-info">
                    <h3 className="class-title">{cls.materia}</h3>
                    <p className="class-prof">{cls.profesor}</p>
                    <div className="class-meta-badges">
                      <span className="meta-badge">{cls.curso} {cls.division}</span>
                      <span className="meta-badge turno-badge">
                        {cls.turno === 'Mañana' ? '🌅' : cls.turno === 'Tarde' ? '🌤️' : '🌙'} {cls.turno}
                      </span>
                    </div>
                  </div>
                </div>
                
                <div className="card-footer">
                  <div className="footer-item">
                    <Calendar size={14} />
                    <span>{getPendingCount(cls.id)}</span>
                  </div>
                  <div className="footer-item">
                    <Users size={14} />
                    <span>{cls.alumnos?.length || 0}</span>
                  </div>
                  {isProfesor && cls.profesorEmail === currentUser?.email && (
                    <button
                      className="delete-class-btn"
                      onClick={(e) => handleDelete(e, cls.id)}
                      aria-label="Eliminar clase"
                      title="Eliminar clase"
                    >
                      <Trash2 size={14} />
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Recent Activity */}
      <div className="recent-activity-section">
        <h3 className="section-title">Actividad Reciente</h3>
        <div className="activity-grid">
          {classes.length > 0 ? (
            classes.slice(-4).reverse().map((cls) => (
              <div key={cls.id} className="activity-item">
                <FileText className="activity-icon text-success" size={20} />
                <div className="activity-details">
                  <h4 className="activity-title text-success">Clase creada: {cls.materia}</h4>
                  <p className="activity-subtitle">{cls.curso} {cls.division} – Turno {cls.turno}</p>
                </div>
              </div>
            ))
          ) : (
            <div className="activity-item">
              <MessageSquare className="activity-icon text-muted" size={20} />
              <div className="activity-details">
                <h4 className="activity-title">Sin actividad reciente</h4>
                <p className="activity-subtitle">La actividad aparecerá cuando se creen clases.</p>
              </div>
            </div>
          )}
        </div>
        <div className="dashboard-footer">
          Soporte Técnico | Términos y Privacidad | © 2024 Edu-Tech
        </div>
      </div>

      {/* Create Class Modal */}
      <CreateClassModal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
      />
    </div>
  );
};

export default Dashboard;
