import React, { useState, useRef } from 'react';
import { X, Upload, FileText, CheckCircle2, Loader2, AlertCircle } from 'lucide-react';
import { useAppContext } from '../context/AppContext';
import './CreateClassModal.css';

const SubmitWorkModal = ({ isOpen, onClose, task }) => {
  const { addSubmission } = useAppContext();
  const [file, setFile] = useState(null);
  const [comment, setComment] = useState('');
  const [isDragging, setIsDragging] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  const [closing, setClosing] = useState(false);
  const fileInputRef = useRef(null);

  const handleClose = () => {
    setClosing(true);
    setTimeout(() => {
      setClosing(false);
      setFile(null);
      setComment('');
      setError('');
      setSuccess(false);
      onClose();
    }, 250);
  };

  const processFile = (f) => {
    const allowedTypes = ['application/pdf', 'application/msword', 
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'application/zip', 'image/png', 'image/jpeg'];
    
    if (!allowedTypes.some(t => f.type === t) && !f.name.match(/\.(pdf|doc|docx|zip|png|jpg|jpeg)$/i)) {
      setError('Formato no válido. Subí PDF, Word, ZIP o imágenes.');
      return;
    }
    setError('');
    const sizeMB = (f.size / (1024 * 1024)).toFixed(2);
    
    const reader = new FileReader();
    reader.onload = (e) => {
      setFile({ 
        name: f.name, 
        size: `${sizeMB} MB`, 
        type: f.type || 'archivo',
        data: e.target.result // Base64 string
      });
    };
    reader.readAsDataURL(f);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const dropped = e.dataTransfer.files[0];
    if (dropped) processFile(dropped);
  };

  const handleFileChange = (e) => {
    const selected = e.target.files[0];
    if (selected) processFile(selected);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!file) { setError('Seleccioná un archivo para entregar.'); return; }
    setIsSubmitting(true);
    
    // Simulate upload delay
    setTimeout(() => {
      addSubmission({
        taskId: task.id,
        taskTitle: task.title,
        classId: task.classId,
        fileName: file.name,
        fileSize: file.size,
        fileData: file.data, // Storing base64
        comment,
      });
      setIsSubmitting(false);
      setSuccess(true);
      setTimeout(() => handleClose(), 1800);
    }, 1000);
  };

  if (!isOpen && !closing) return null;

  return (
    <div className={`modal-overlay ${closing ? 'modal-closing' : ''}`} onClick={handleClose}>
      <div className={`modal-card ${closing ? 'modal-card-closing' : ''}`} onClick={e => e.stopPropagation()}>

        <div className="modal-header">
          <div className="modal-header-info">
            <div className="modal-header-icon" style={{ background: 'linear-gradient(135deg, #10b981, #059669)' }}>
              <Upload size={24} />
            </div>
            <div>
              <h2 className="modal-title">Entregar Trabajo</h2>
              <p className="modal-subtitle">{task?.title}</p>
            </div>
          </div>
          <button className="modal-close-btn" onClick={handleClose}><X size={20} /></button>
        </div>

        {success ? (
          <div className="modal-success">
            <div className="success-icon-wrapper" style={{ background: 'rgba(16, 185, 129, 0.15)', color: '#10b981' }}>
              <CheckCircle2 size={48} />
            </div>
            <h3>¡Trabajo entregado!</h3>
            <p className="success-preview">{file?.name}</p>
          </div>
        ) : (
          <form className="modal-form" onSubmit={handleSubmit}>

            {/* Drop Zone */}
            <div
              className={`dropzone-area ${isDragging ? 'dropzone-active' : ''} ${file ? 'dropzone-has-file' : ''}`}
              onDragOver={e => { e.preventDefault(); setIsDragging(true); }}
              onDragLeave={() => setIsDragging(false)}
              onDrop={handleDrop}
              onClick={() => !file && fileInputRef.current?.click()}
            >
              {file ? (
                <div className="file-selected-strip">
                  <FileText size={28} color="#10b981" />
                  <div style={{ flex: 1 }}>
                    <p style={{ color: 'white', fontWeight: 700, margin: 0 }}>{file.name}</p>
                    <p style={{ color: '#94a3b8', fontSize: '12px', margin: 0 }}>{file.size}</p>
                  </div>
                  <button
                    type="button"
                    style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer' }}
                    onClick={(e) => { e.stopPropagation(); setFile(null); }}
                  >
                    <X size={18} />
                  </button>
                </div>
              ) : (
                <>
                  <div className="dropzone-icon-wrapper">
                    <Upload size={28} />
                  </div>
                  <p className="dropzone-title">
                    {isDragging ? 'Soltá el archivo aquí' : 'Arrastrá tu trabajo aquí'}
                  </p>
                  <p className="dropzone-subtitle">PDF, Word, ZIP o Imágenes • o hacé clic para seleccionar</p>
                </>
              )}
              <input
                ref={fileInputRef}
                type="file"
                accept=".pdf,.doc,.docx,.zip,.png,.jpg,.jpeg"
                style={{ display: 'none' }}
                onChange={handleFileChange}
              />
            </div>

            {/* Comment */}
            <div className="form-field">
              <label>Comentario para el profesor (opcional)</label>
              <textarea
                placeholder="Podés aclarar algo sobre tu entrega..."
                value={comment}
                onChange={e => setComment(e.target.value)}
                style={{
                  background: 'rgba(0,0,0,0.2)', border: '1px solid rgba(255,255,255,0.1)',
                  padding: '14px', borderRadius: '12px', color: 'white',
                  minHeight: '80px', resize: 'vertical', width: '100%', boxSizing: 'border-box'
                }}
              />
            </div>

            {error && (
              <div className="modal-error">
                <AlertCircle size={18} /><span>{error}</span>
              </div>
            )}

            <button
              type="submit"
              className="modal-submit-btn"
              disabled={isSubmitting}
              style={{ background: 'linear-gradient(135deg, #10b981, #059669)' }}
            >
              {isSubmitting ? <Loader2 size={20} className="spinner" /> : 'Entregar Trabajo'}
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default SubmitWorkModal;
