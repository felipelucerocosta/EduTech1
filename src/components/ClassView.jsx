import React, { useState } from 'react';
import { 
  Settings, MessageCircle, Heart, ThumbsUp, MoreHorizontal, 
  FileText, Send, Plus, Calendar, BookOpen 
} from 'lucide-react';
import { useAppContext } from '../context/AppContext';
import AddTaskModal from './AddTaskModal';
import AddResourceModal from './AddResourceModal';
import './ClassView.css';

const ClassView = ({ classId }) => {
  const { classes, messages, addMessage, currentUser } = useAppContext();
  const [newMessage, setNewMessage] = useState('');
  const [showTaskModal, setShowTaskModal] = useState(false);
  const [showResourceModal, setShowResourceModal] = useState(false);

  const currentClass = classes.find(c => c.id === classId);
  const classMessages = messages.filter(m => m.classId === classId);
  const isProfesor = currentUser?.role === 'profesor';

  if (!currentClass) {
    return <div className="class-view-container">Cargando clase...</div>;
  }

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
               <Calendar size={18} /> <span className="hide-on-mobile">CREAR TAREA</span>
            </button>
            <button className="btn-primary" style={{background: 'var(--secondary)'}} onClick={() => setShowResourceModal(true)}>
               <BookOpen size={18} /> <span className="hide-on-mobile">SUBIR RECURSO</span>
            </button>
          </div>
        )}
      </div>

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

      {/* Modals */}
      <AddTaskModal 
        isOpen={showTaskModal} 
        onClose={() => setShowTaskModal(false)} 
        currentClass={currentClass} 
      />
      <AddResourceModal 
        isOpen={showResourceModal} 
        onClose={() => setShowResourceModal(false)} 
        currentClass={currentClass} 
      />
    </div>
  );
};

export default ClassView;
