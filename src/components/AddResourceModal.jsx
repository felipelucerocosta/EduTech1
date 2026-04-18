import React, { useState } from 'react';
import { X, BookOpen, Type, Tag, AlertCircle, CheckCircle2, Loader2, FileText } from 'lucide-react';
import { useAppContext } from '../context/AppContext';
import './CreateClassModal.css';

const AddResourceModal = ({ isOpen, onClose, currentClass }) => {
  const { addResource } = useAppContext();
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('Manuales');
  const [type, setType] = useState('PDF');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [closing, setClosing] = useState(false);

  const categories = ['Manuales', 'Planos', 'Software', 'Tutoriales'];
  const types = ['PDF', 'DWG', 'EXE', 'ZIP', 'DOCX'];

  const handleClose = () => {
    setClosing(true);
    setTimeout(() => {
      setClosing(false);
      setTitle('');
      setCategory('Manuales');
      setType('PDF');
      setError('');
      setSuccess(false);
      onClose();
    }, 250);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title) {
      setError('Ingresá un título para el recurso.');
      return;
    }

    setIsSubmitting(true);
    setTimeout(() => {
      const result = addResource({ 
        classId: currentClass.id, 
        title, 
        category, 
        type,
        size: '--- MB',
        icon: category === 'Manuales' ? '📘' : category === 'Planos' ? '📐' : category === 'Software' ? '💾' : '📄'
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
              <BookOpen size={24} />
            </div>
            <div>
              <h2 className="modal-title">Subir Recurso Técnico</h2>
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
            <h3>¡Recurso añadido!</h3>
            <p className="success-preview">{title}</p>
          </div>
        ) : (
          <form className="modal-form" onSubmit={handleSubmit}>
            <div className="form-field">
              <label><Type size={16} className="label-icon" /> Nombre del Recurso</label>
              <input 
                type="text" 
                placeholder="Ej: Manual de Robótica I" 
                style={{
                  background: 'rgba(0,0,0,0.2)', border: '1px solid rgba(255,255,255,0.1)', 
                  padding: '14px', borderRadius: '12px', color: 'white'
                }}
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
            </div>

            <div className="form-row">
              <div className="form-field">
                <label><Tag size={16} className="label-icon" /> Categoría</label>
                <select 
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  style={{
                    background: 'rgba(0,0,0,0.2)', border: '1px solid rgba(255,255,255,0.1)', 
                    padding: '14px', borderRadius: '12px', color: 'white'
                  }}
                >
                  {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                </select>
              </div>
              <div className="form-field">
                <label><FileText size={16} className="label-icon" /> Tipo de Archivo</label>
                <select 
                  value={type}
                  onChange={(e) => setType(e.target.value)}
                  style={{
                    background: 'rgba(0,0,0,0.2)', border: '1px solid rgba(255,255,255,0.1)', 
                    padding: '14px', borderRadius: '12px', color: 'white'
                  }}
                >
                  {types.map(t => <option key={t} value={t}>{t}</option>)}
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
              {isSubmitting ? <Loader2 size={20} className="spinner" /> : 'Añadir Recurso'}
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default AddResourceModal;
