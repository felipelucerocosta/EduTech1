import React, { useState } from 'react';
import { X, Calendar, Type, Clock, AlertCircle, CheckCircle2, Loader2, Tag } from 'lucide-react';
import { useAppContext } from '../context/AppContext';
import './CreateClassModal.css'; // Reuse existing modal styles

const AddTaskModal = ({ isOpen, onClose, currentClass }) => {
  const { addTask } = useAppContext();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [priority, setPriority] = useState('medium');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [closing, setClosing] = useState(false);

  const handleClose = () => {
    setClosing(true);
    setTimeout(() => {
      setClosing(false);
      setTitle('');
      setDescription('');
      setDueDate('');
      setPriority('medium');
      setError('');
      setSuccess(false);
      onClose();
    }, 250);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title || !dueDate) {
      setError('Completá todos los campos obligatorios.');
      return;
    }

    setIsSubmitting(true);
    setTimeout(() => {
      const result = addTask({ 
        classId: currentClass.id, 
        title, 
        description,
        dueDate, 
        priority, 
        subject: currentClass.materia,
        icon: '📝',
        status: 'pending'
      });
      setIsSubmitting(false);
      if (result.success) {
        setSuccess(true);
        setTimeout(() => handleClose(), 1200);
      } else {
        setError(result.error);
      }
    }, 600);
  };

  if (!isOpen && !closing) return null;

  return (
    <div className={`modal-overlay ${closing ? 'modal-closing' : ''}`} onClick={handleClose}>
      <div className={`modal-card ${closing ? 'modal-card-closing' : ''}`} onClick={(e) => e.stopPropagation()}>
        
        <div className="modal-header">
          <div className="modal-header-info">
            <div className="modal-header-icon">
              <Calendar size={24} />
            </div>
            <div>
              <h2 className="modal-title">Asignar Nueva Tarea</h2>
              <p className="modal-subtitle">Para {currentClass?.materia}</p>
            </div>
          </div>
          <button className="modal-close-btn" onClick={handleClose}>
            <X size={20} />
          </button>
        </div>

        {success ? (
          <div className="modal-success">
            <div className="success-icon-wrapper">
              <CheckCircle2 size={48} />
            </div>
            <h3>¡Tarea asignada!</h3>
            <p className="success-preview">{title}</p>
          </div>
        ) : (
          <form className="modal-form" onSubmit={handleSubmit}>
            <div className="form-field">
              <label><Type size={16} className="label-icon" /> Título de la Tarea</label>
              <input 
                type="text" 
                placeholder="Ej: Informe de Práctica 4" 
                className="modal-input"
                style={{
                  background: 'rgba(0,0,0,0.2)', border: '1px solid rgba(255,255,255,0.1)', 
                  padding: '14px', borderRadius: '12px', color: 'white'
                }}
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
            </div>

            <div className="form-field">
              <label><AlertCircle size={16} className="label-icon" /> Descripción / Instrucciones</label>
              <textarea 
                placeholder="Explica qué deben entregar los alumnos..." 
                className="modal-input"
                style={{
                  background: 'rgba(0,0,0,0.2)', border: '1px solid rgba(255,255,255,0.1)', 
                  padding: '14px', borderRadius: '12px', color: 'white',
                  minHeight: '100px', resize: 'vertical'
                }}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>

            <div className="form-row">
              <div className="form-field">
                <label><Clock size={16} className="label-icon" /> Fecha de Entrega</label>
                <input 
                  type="date" 
                  style={{
                    background: 'rgba(0,0,0,0.2)', border: '1px solid rgba(255,255,255,0.1)', 
                    padding: '14px', borderRadius: '12px', color: 'white'
                  }}
                  value={dueDate}
                  onChange={(e) => setDueDate(e.target.value)}
                />
              </div>
              <div className="form-field">
                <label><Tag size={16} className="label-icon" /> Prioridad</label>
                <select 
                  value={priority}
                  onChange={(e) => setPriority(e.target.value)}
                  style={{
                    background: 'rgba(0,0,0,0.2)', border: '1px solid rgba(255,255,255,0.1)', 
                    padding: '14px', borderRadius: '12px', color: 'white'
                  }}
                >
                  <option value="high">Crítica</option>
                  <option value="medium">Importante</option>
                  <option value="low">Normal</option>
                </select>
              </div>
            </div>

            {error && (
              <div className="modal-error">
                <AlertCircle size={18} />
                <span>{error}</span>
              </div>
            )}

            <button type="submit" className="modal-submit-btn" disabled={isSubmitting}>
              {isSubmitting ? <Loader2 size={20} className="spinner" /> : 'Asignar Tarea'}
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default AddTaskModal;
