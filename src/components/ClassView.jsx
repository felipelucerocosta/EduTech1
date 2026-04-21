import React, { useState } from 'react';
import { 
  Settings, MessageCircle, Heart, ThumbsUp, MoreHorizontal, 
  FileText, Send, Plus, Calendar as CalendarIcon, BookOpen,
  Clock, CheckCircle2, Download
} from 'lucide-react';
import { useAppContext } from '../context/AppContext';
import AddTaskModal from './AddTaskModal';
import AddResourceModal from './AddResourceModal';
import CalendarComponent from './Calendar';
import SubmitWorkModal from './SubmitWorkModal';
import './ClassView.css';

const ClassView = ({ classId }) => {
  const { classes, messages, resources, tasks, submissions, addMessage, currentUser, gradeSubmission } = useAppContext();
  const [newMessage, setNewMessage] = useState('');
  const [showTaskModal, setShowTaskModal] = useState(false);
  const [showResourceModal, setShowResourceModal] = useState(false);
  const [activeTab, setActiveTab] = useState('forum');
  const [selectedTask, setSelectedTask] = useState(null);
  const [expandedTask, setExpandedTask] = useState(null); // professor: view submissions
  const [gradeInputs, setGradeInputs] = useState({}); // { [submissionId]: { grade, feedback } }

  const currentClass = classes.find(c => c.id === classId);
  const classMessages = messages.filter(m => m.classId === classId);
  const classTasks = tasks.filter(t => t.classId === classId);
  const isProfesor = currentUser?.role === 'profesor';

  if (!currentClass) {
    return <div className="class-view-container">Cargando clase...</div>;
  }

  const renderTrabajos = () => {
    const handleGradeChange = (subId, field, value) => {
      setGradeInputs(prev => ({
        ...prev,
        [subId]: { ...prev[subId], [field]: value }
      }));
    };

    const handleGradeSubmit = (subId) => {
      const input = gradeInputs[subId] || {};
      if (!input.grade) return;
      gradeSubmission(subId, input.grade, input.feedback || '');
    };

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
      <div className="trabajos-tab-content animate-fade-in">
        <div className="trabajos-tab-header">
          <div>
            <h3 className="tab-view-title">Trabajos Prácticos y Evaluaciones</h3>
            <p className="tab-view-subtitle">Gestioná tus entregas y consultá las consignas de la materia</p>
          </div>
          {isProfesor && (
            <button className="btn-primary" onClick={() => setShowTaskModal(true)}>
              <Plus size={18} /> <span className="hide-on-mobile">ASIGNAR TRABAJO</span>
            </button>
          )}
        </div>

        <div className="assignments-list">
          {classTasks.length === 0 ? (
            <div className="empty-state-trabajos">
              <FileText size={64} style={{opacity: 0.2, marginBottom: '20px'}} />
              <h4>No hay trabajos asignados</h4>
              <p>Las tareas aparecerán aquí cuando el profesor las publique.</p>
            </div>
          ) : (
            [...classTasks].reverse().map(task => {
              const taskSubmissions = submissions?.filter(s => s.taskId === task.id) || [];
              const isExpanded = expandedTask === task.id;

              return (
                <div key={task.id} className="assignment-card-premium">
                  <div className="assignment-main">
                    <div className={`assignment-priority-bar ${task.priority}`}></div>
                    <div className="assignment-body">
                      <div className="assignment-top">
                        <span className="assignment-subject-tag">{currentClass.materia}</span>
                        <span className="assignment-due-date">
                          <Clock size={14} /> Vence: {task.dueDate}
                        </span>
                      </div>
                      <h4 className="assignment-card-title">{task.title}</h4>
                      <p className="assignment-card-description">
                        {task.description || 'Sin instrucciones adicionales.'}
                      </p>

                      {/* Professor: submission count badge */}
                      {isProfesor && (
                        <button
                          className={`submissions-count-btn ${isExpanded ? 'active' : ''}`}
                          onClick={() => setExpandedTask(isExpanded ? null : task.id)}
                        >
                          <CheckCircle2 size={15} />
                          <span>{taskSubmissions.length} entrega{taskSubmissions.length !== 1 ? 's' : ''} recibida{taskSubmissions.length !== 1 ? 's' : ''}</span>
                          <span className="submissions-chevron">{isExpanded ? '▲' : '▼'}</span>
                        </button>
                      )}
                    </div>

                    {/* Alumno: submit button */}
                    {!isProfesor && (
                      <div className="assignment-actions">
                        <div className={`assignment-status-tag ${task.status}`}>
                          {task.status === 'completed' ? <CheckCircle2 size={14} /> : <Clock size={14} />}
                          {task.status === 'completed' ? 'Entregado' : 'Pendiente'}
                        </div>
                        {(() => {
                          const submitted = submissions?.find(
                            s => s.taskId === task.id && s.authorEmail === currentUser?.email
                          );
                          return submitted ? (
                            <div style={{ textAlign: 'center' }}>
                              <div className="assignment-status-tag completed">
                                <CheckCircle2 size={14} /> Entregado
                              </div>
                              {submitted.grade && (
                                <div className="grade-display">
                                  <span className="grade-value">{submitted.grade}</span>
                                  {submitted.feedback && <p className="grade-feedback">"{submitted.feedback}"</p>}
                                </div>
                              )}
                            </div>
                          ) : (
                            <button
                              className="btn-entregar-premium"
                              onClick={() => setSelectedTask(task)}
                            >
                              Subir Trabajo
                            </button>
                          );
                        })()}
                      </div>
                    )}
                  </div>

                  {/* Professor: expanded submission list with grading and DOWNLOAD */}
                  {isProfesor && isExpanded && (
                    <div className="submissions-panel">
                      {taskSubmissions.length === 0 ? (
                        <p className="no-submissions-msg">Ningún alumno ha entregado aún.</p>
                      ) : (
                        taskSubmissions.map(sub => {
                          const input = gradeInputs[sub.id] || {};
                          const alreadyGraded = sub.grade;
                          return (
                            <div key={sub.id} className="submission-row">
                              <div className="submission-student-info">
                                <div className="submission-avatar">
                                  {sub.authorName?.[0] || 'A'}
                                </div>
                                <div style={{ flex: 1 }}>
                                  <p className="submission-student-name">{sub.authorName}</p>
                                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                    <p className="submission-file">
                                      📎 {sub.fileName} · {sub.fileSize}
                                    </p>
                                    <button 
                                      className="btn-download-mini" 
                                      onClick={() => handleDownload(sub.fileData, sub.fileName)}
                                      title="Descargar Trabajo"
                                      style={{ padding: '4px', borderRadius: '4px', background: 'var(--primary)', color: 'white', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center' }}
                                    >
                                      <Download size={14} />
                                    </button>
                                  </div>
                                  {sub.comment && (
                                    <p className="submission-comment">"{sub.comment}"</p>
                                  )}
                                  <p className="submission-date">
                                    Entregado: {new Date(sub.submittedAt).toLocaleString('es-AR')}
                                  </p>
                                </div>
                              </div>

                              {alreadyGraded ? (
                                <div className="grade-badge-prof">
                                  <span className="grade-number">{sub.grade}</span>
                                  {sub.feedback && <p className="grade-feedback-text">{sub.feedback}</p>}
                                </div>
                              ) : (
                                <div className="grading-form">
                                  <input
                                    type="number"
                                    min="1"
                                    max="10"
                                    placeholder="Nota"
                                    className="grade-input"
                                    value={input.grade || ''}
                                    onChange={e => handleGradeChange(sub.id, 'grade', e.target.value)}
                                  />
                                  <input
                                    type="text"
                                    placeholder="Devolución (opcional)"
                                    className="feedback-input"
                                    value={input.feedback || ''}
                                    onChange={e => handleGradeChange(sub.id, 'feedback', e.target.value)}
                                  />
                                  <button
                                    className="btn-grade-submit"
                                    onClick={() => handleGradeSubmit(sub.id)}
                                    disabled={!input.grade}
                                  >
                                    Calificar
                                  </button>
                                </div>
                              )}
                            </div>
                          );
                        })
                      )}
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>
      </div>
    );
  };

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!newMessage.trim()) return;
    addMessage({ classId, content: newMessage });
    setNewMessage('');
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

  return (
    <div className="class-view-container animate-fade-in">
      <div className="class-header-card">
        <div className="class-header-icon">
          <span style={{fontSize: '32px'}}>{MATERIA_ICONS[currentClass.materia] || '📘'}</span>
        </div>
        <div className="class-header-info">
          <h2 className="class-view-title">{currentClass.materia.toUpperCase()}</h2>
          <h3 className="class-view-subtitle">{currentClass.curso} {currentClass.division} – Turno {currentClass.turno}</h3>
        </div>
        {isProfesor && (
          <div className="professor-actions-header" style={{marginLeft: 'auto', display: 'flex', gap: '12px'}}>
            <button className="btn-primary" onClick={() => setShowTaskModal(true)}>
               <CalendarIcon size={18} /> <span className="hide-on-mobile">CREAR TAREA</span>
            </button>
            <button className="btn-primary" style={{background: 'var(--secondary)'}} onClick={() => setShowResourceModal(true)}>
               <BookOpen size={18} /> <span className="hide-on-mobile">SUBIR RECURSO</span>
            </button>
          </div>
        )}
      </div>

      <div className="class-tabs-container">
        <button 
          className={`class-tab ${activeTab === 'forum' ? 'active' : ''}`}
          onClick={() => setActiveTab('forum')}
        >
          <MessageCircle size={18} />
          <span>MURO</span>
        </button>
        <button 
          className={`class-tab ${activeTab === 'trabajos' ? 'active' : ''}`}
          onClick={() => setActiveTab('trabajos')}
        >
          <FileText size={18} />
          <span>TRABAJOS</span>
        </button>
        <button 
          className={`class-tab ${activeTab === 'calendar' ? 'active' : ''}`}
          onClick={() => setActiveTab('calendar')}
        >
          <CalendarIcon size={18} />
          <span>CALENDARIO</span>
        </button>
      </div>

      {activeTab === 'forum' ? (
        <div className="class-content-layout">
          <div className="forum-main-column">
            
            <form className="add-post-card" onSubmit={handleSendMessage}>
              <div className="user-avatar">
                <div style={{width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--primary)', color: 'white', fontWeight: 'bold'}}>
                  {currentUser?.name[0]}
                </div>
              </div>
              <div className="post-input-wrapper">
                <input 
                  type="text" 
                  placeholder="Comparte dudas, proyectos o anuncios..." 
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                />
                <button type="submit" className="btn-share">Publicar</button>
              </div>
            </form>

            {classMessages.length === 0 ? (
              <div className="empty-state" style={{padding: '40px', background: 'var(--bg-glass)', borderRadius: '20px', textAlign: 'center'}}>
                <MessageCircle size={48} color="var(--text-dim)" style={{marginBottom: '16px'}} />
                <h4 style={{color: 'var(--text-main)'}}>No hay publicaciones aún</h4>
                <p style={{color: 'var(--text-dim)'}}>¡Sé el primero en compartir algo con la clase!</p>
              </div>
            ) : (
              [...classMessages].reverse().map(msg => (
                <div key={msg.id} className="post-card">
                  <div className="post-header">
                    <div className="post-author">
                      <div className="user-avatar small">
                        <div style={{width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', background: msg.authorRole === 'profesor' ? 'var(--secondary)' : 'var(--primary)', color: 'white', fontWeight: 'bold', fontSize: '12px'}}>
                          {msg.author[0]}
                        </div>
                      </div>
                      <div className="post-title-area">
                        <h4 className="post-title" style={{fontSize: '15px'}}>{msg.author} <span style={{fontSize: '11px', color: 'var(--text-dim)', marginLeft: '8px', fontWeight: 'normal'}}>{msg.authorRole.toUpperCase()}</span></h4>
                        <p style={{fontSize: '11px', color: 'var(--text-dim)'}}>{new Date(msg.timestamp).toLocaleString()}</p>
                      </div>
                    </div>
                    <button className="action-btn"><MoreHorizontal size={20} /></button>
                  </div>
                  <div className="post-body">
                    <p>{msg.content}</p>
                  </div>
                  <div className="post-footer">
                    <button className="footer-action"><MessageCircle size={16} /> Comentar</button>
                    <button className="footer-action"><Heart size={16} /> {msg.likes}</button>
                    <div className="spacer"></div>
                    <button className="footer-action"><ThumbsUp size={16} /></button>
                  </div>
                </div>
              ))
            )}
          </div>

          <div className="forum-side-column">
            <div className="side-widget">
              <h4 className="widget-title">MIEMBROS DE LA CLASE</h4>
              <div className="members-list">
                {currentClass.alumnos && currentClass.alumnos.length > 0 ? (
                  currentClass.alumnos.map((member, i) => (
                    <div key={i} className="member-item">
                      <div className="user-avatar small">
                        <div style={{width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--bg-side)', color: 'var(--text-dim)', fontSize: '12px'}}>
                          {member[0]}
                        </div>
                      </div>
                      <span className="member-name">{member}</span>
                    </div>
                  ))
                ) : (
                  <p style={{fontSize: '12px', color: 'var(--text-dim)'}}>No hay alumnos inscriptos.</p>
                )}
              </div>
            </div>

            <div className="side-widget mt-20">
              <h4 className="widget-title">RECURSOS DE LA CLASE</h4>
              <div className="resources-list">
                {resources.filter(r => r.classId === classId).length > 0 ? (
                  resources.filter(r => r.classId === classId).map((res) => (
                    <div key={res.id} className="resource-item">
                      <div className="resource-icon" style={{fontSize: '18px'}}>
                        {res.icon || '📄'}
                      </div>
                      <div style={{flex: 1, minWidth: 0}}>
                        <span className="member-name" style={{display: 'block', textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap'}}>
                          {res.title}
                        </span>
                        <span style={{fontSize: '10px', color: 'var(--text-dim)'}}>{res.size} • {res.type}</span>
                      </div>
                      <button 
                        onClick={() => {
                          if (!res.fileData) return;
                          const link = document.createElement('a');
                          link.href = res.fileData;
                          link.download = res.fileName || res.title;
                          document.body.appendChild(link);
                          link.click();
                          document.body.removeChild(link);
                        }}
                        style={{ background: 'none', border: 'none', color: 'var(--primary)', cursor: 'pointer', padding: '4px' }}
                        title="Descargar Recurso"
                      >
                        <Download size={14} />
                      </button>
                    </div>
                  ))
                ) : (
                  <p style={{fontSize: '12px', color: 'var(--text-dim)'}}>No se han subido materiales aún.</p>
                )}
              </div>
            </div>

            <div className="side-widget mt-20">
              <h4 className="widget-title">INFO DEL PROFESOR</h4>
              <div className="member-item">
                <div className="user-avatar small">
                  <div style={{width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--secondary)', color: 'white', fontSize: '12px'}}>
                    {currentClass.profesor[0]}
                  </div>
                </div>
                <div>
                  <span className="member-name" style={{display: 'block'}}>{currentClass.profesor}</span>
                  <span style={{fontSize: '11px', color: 'var(--text-dim)'}}>{currentClass.profesorEmail}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : activeTab === 'trabajos' ? (
        renderTrabajos()
      ) : (
        <div className="calendar-tab-content animate-fade-in">
           <CalendarComponent classId={classId} />
        </div>
      )}

      {/* Modals */}
      <AddTaskModal 
        isOpen={showTaskModal} 
        onClose={() => setShowTaskModal(false)} 
        currentClass={currentClass} 
      />
      {showResourceModal && currentClass && (
        <AddResourceModal 
          isOpen={true} 
          onClose={() => setShowResourceModal(false)} 
          currentClass={currentClass} 
        />
      )}
      <SubmitWorkModal
        isOpen={!!selectedTask}
        onClose={() => setSelectedTask(null)}
        task={selectedTask}
      />
    </div>
  );
};

export default ClassView;
