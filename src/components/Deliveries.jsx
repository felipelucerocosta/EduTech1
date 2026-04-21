import React, { useState } from 'react';
import { Calendar, CheckCircle2, AlertCircle, Inbox, FileText, Download, User, ChevronDown, ChevronUp, Upload } from 'lucide-react';
import { useAppContext } from '../context/AppContext';
import AddResourceModal from './AddResourceModal';
import './Deliveries.css';

const Deliveries = () => {
  const { tasks, submissions, resources, classes, currentUser } = useAppContext();
  const [expandedTask, setExpandedTask] = useState(null);
  const [activeSubTab, setActiveSubTab] = useState('tareas');
  const [showUploadModal, setShowUploadModal] = useState(false);

  const isProfesor = currentUser?.role === 'profesor';

  // Profesor sees only their tasks; alumnos see all tasks
  const filteredTasks = isProfesor
    ? tasks.filter(t => t.creatorEmail === currentUser?.email)
    : tasks;

  // Classes owned by this professor (for the upload modal)
  const profesorClasses = isProfesor
    ? classes.filter(c => c.profesorEmail === currentUser?.email)
    : [];

  const handleDownload = (fileData, fileName) => {
    if (!fileData) return;
    const link = document.createElement('a');
    link.href = fileData;
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="deliveries-container animate-fade-in">
      <div className="deliveries-header">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '16px' }}>
          <div>
            <h1 className="page-title">
              {isProfesor ? 'Gestión de Trabajos' : 'Trabajos y Materiales'}
            </h1>
            <div className="title-divider"></div>
          </div>

          {/* "Subir Recurso" button — only visible to professors in the materials tab */}
          {isProfesor && activeSubTab === 'materiales' && (
            <button
              className="btn-primary"
              onClick={() => {
                if (profesorClasses.length === 0) {
                  alert('Primero creá una clase para poder subir recursos.');
                  return;
                }
                setShowUploadModal(true);
              }}
              style={{ padding: '10px 20px', display: 'flex', alignItems: 'center', gap: '8px' }}
            >
              <Upload size={16} />
              Subir Recurso
            </button>
          )}
        </div>

        <div className="deliveries-sub-tabs">
          <button
            className={`sub-tab ${activeSubTab === 'tareas' ? 'active' : ''}`}
            onClick={() => setActiveSubTab('tareas')}
          >
            Tareas y Entregas
          </button>
          <button
            className={`sub-tab ${activeSubTab === 'materiales' ? 'active' : ''}`}
            onClick={() => setActiveSubTab('materiales')}
          >
            Material de Estudio
          </button>
        </div>
      </div>

      <div className="tasks-list">

        {/* ─── Sub-tab: Tareas ─── */}
        {activeSubTab === 'tareas' && (
          filteredTasks.length === 0 ? (
            <div className="empty-state" style={{ marginTop: '40px' }}>
              <Inbox size={48} color="var(--text-dim)" style={{ marginBottom: '16px' }} />
              <h3>{isProfesor ? 'No has asignado trabajos aún' : 'No hay tareas asignadas'}</h3>
              <p className="page-subtitle">
                {isProfesor
                  ? 'Las tareas que crees en tus clases aparecerán aquí.'
                  : 'Cuando el profesor asigne trabajos, los verás aquí.'}
              </p>
            </div>
          ) : (
            filteredTasks.map((task) => {
              const taskSubmissions = submissions.filter(s => s.taskId === task.id);
              const isExpanded = expandedTask === task.id;
              const studentSubmission = !isProfesor
                ? submissions.find(s => s.taskId === task.id && s.authorEmail === currentUser?.email)
                : null;

              return (
                <div key={task.id} className={`task-card ${task.status || 'pending'}`}>
                  <div
                    className="task-content"
                    onClick={() => isProfesor && setExpandedTask(isExpanded ? null : task.id)}
                    style={{ cursor: isProfesor ? 'pointer' : 'default' }}
                  >
                    <div className="task-icon-box">
                      <span className="task-emoji">{task.icon || '📝'}</span>
                    </div>
                    <div className="task-info">
                      <div className="task-top">
                        <span className="task-subject">{task.materia || task.subject}</span>
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
                        {isProfesor ? (
                          <div className="meta-item">
                            <CheckCircle2 size={14} color="#10b981" />
                            <span>{taskSubmissions.length} entregas</span>
                          </div>
                        ) : (
                          <div className="meta-item">
                            {studentSubmission
                              ? <CheckCircle2 size={14} style={{ color: '#10b981' }} />
                              : <AlertCircle size={14} style={{ color: '#f59e0b' }} />
                            }
                            <span style={{ color: studentSubmission ? '#10b981' : '#f59e0b' }}>
                              {studentSubmission ? 'Entregado' : 'Pendiente'}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                    {isProfesor && (
                      <div style={{ alignSelf: 'center', color: 'var(--text-dim)', paddingRight: '8px' }}>
                        {isExpanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                      </div>
                    )}
                  </div>

                  {/* Professor: expandable submissions list */}
                  {isProfesor && isExpanded && (
                    <div className="submissions-dropdown animate-fade-in">
                      <h4 className="submissions-title">Alumnos que entregaron:</h4>
                      {taskSubmissions.length === 0 ? (
                        <p className="no-submissions">Nadie ha entregado este trabajo todavía.</p>
                      ) : (
                        <div className="submissions-grid">
                          {taskSubmissions.map((sub) => (
                            <div key={sub.id} className="submission-item-mini">
                              <div className="sub-user-info">
                                <User size={16} />
                                <span>{sub.authorName}</span>
                              </div>
                              <div className="sub-file-info">
                                <FileText size={14} />
                                <span className="file-name-truncate">{sub.fileName}</span>
                              </div>
                              <button
                                className="btn-download-mini"
                                onClick={() => handleDownload(sub.fileData, sub.fileName)}
                                title="Descargar archivo"
                              >
                                <Download size={16} />
                              </button>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })
          )
        )}

        {/* ─── Sub-tab: Materiales ─── */}
        {activeSubTab === 'materiales' && (
          resources.length === 0 ? (
            <div className="empty-state" style={{ marginTop: '40px' }}>
              <FileText size={48} color="var(--text-dim)" style={{ marginBottom: '16px' }} />
              <h3>No hay materiales disponibles</h3>
              <p className="page-subtitle">
                {isProfesor
                  ? 'Hacé clic en "Subir Recurso" para agregar el primer material.'
                  : 'Los materiales de estudio aparecerán aquí cuando un profesor los suba.'}
              </p>
            </div>
          ) : (
            <div className="submissions-grid" style={{ padding: '10px 0' }}>
              {resources.map((res) => (
                <div key={res.id} className="submission-item-mini" style={{ width: '100%', maxWidth: 'none' }}>
                  <div className="sub-user-info" style={{ color: 'var(--primary)', minWidth: '90px' }}>
                    <span style={{ fontSize: '20px' }}>{res.icon || '📄'}</span>
                    <span style={{ fontSize: '12px' }}>{res.category}</span>
                  </div>
                  <div className="sub-file-info" style={{ flex: 1 }}>
                    <span style={{ color: 'white', fontWeight: 700, fontSize: '14px' }}>{res.title}</span>
                    <span style={{ fontSize: '11px', color: 'var(--text-dim)', marginLeft: '8px' }}>({res.size})</span>
                  </div>
                  <button
                    className="btn-download-mini"
                    onClick={() => handleDownload(res.fileData, res.fileName || res.title)}
                    title="Descargar material"
                  >
                    <Download size={16} />
                  </button>
                </div>
              ))}
            </div>
          )
        )}

      </div>

      {/* AddResourceModal — shown when professor clicks "Subir Recurso" */}
      {showUploadModal && (
        <AddResourceModal
          isOpen={true}
          onClose={() => setShowUploadModal(false)}
          classes={profesorClasses}
        />
      )}
    </div>
  );
};

export default Deliveries;
