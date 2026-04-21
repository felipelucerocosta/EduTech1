import React, { useState, useRef } from 'react';
import { 
  X, BookOpen, Type, Tag, AlertCircle, CheckCircle2, 
  Loader2, FileText, UploadCloud, Trash2, File, Layers
} from 'lucide-react';
import { useAppContext } from '../context/AppContext';
import './CreateClassModal.css';

/**
 * AddResourceModal
 *
 * Props:
 *  - isOpen: boolean
 *  - onClose: () => void
 *  - currentClass?: { id, materia } — if provided, resource is tied to this class
 *  - classes?: Class[]            — if provided (no currentClass), shows a class selector
 */
const AddResourceModal = ({ isOpen, onClose, currentClass, classes: classesProp }) => {
  const { addResource } = useAppContext();
  const fileInputRef = useRef(null);

  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('Manuales');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [closing, setClosing] = useState(false);

  // If no fixed class, let professor pick one
  const [selectedClassId, setSelectedClassId] = useState(
    currentClass?.id || classesProp?.[0]?.id || ''
  );

  // File upload state
  const [selectedFile, setSelectedFile] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  // Resolve the active class
  const activeClass = currentClass
    || (classesProp && classesProp.find(c => c.id === selectedClassId))
    || null;

  const categories = ['Manuales', 'Planos', 'Software', 'Tutoriales'];

  const handleClose = () => {
    setClosing(true);
    setTimeout(() => {
      setClosing(false);
      resetForm();
      onClose();
    }, 250);
  };

  const resetForm = () => {
    setTitle('');
    setCategory('Manuales');
    setError('');
    setSuccess(false);
    setSelectedFile(null);
    setUploadProgress(0);
  };

  const processFile = (file) => {
    if (!file) return;
    if (!file.name.toLowerCase().endsWith('.pdf')) {
      setError('Por ahora solo se permiten archivos PDF.');
      return;
    }
    const reader = new FileReader();
    reader.onload = (e) => {
      setSelectedFile({ file, name: file.name, size: file.size, data: e.target.result });
      setError('');
      if (!title) {
        setTitle(file.name.split('.').slice(0, -1).join('.'));
      }
    };
    reader.readAsDataURL(file);
  };

  const handleFileChange = (e) => processFile(e.target.files[0]);
  const handleDragOver = (e) => { e.preventDefault(); setIsDragging(true); };
  const handleDragLeave = () => setIsDragging(false);
  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    processFile(e.dataTransfer.files[0]);
  };

  const formatFileSize = (bytes) => {
    if (!bytes) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title.trim()) { setError('Ingresá un título para el recurso.'); return; }
    if (!selectedFile)  { setError('Seleccioná un archivo PDF para subir.'); return; }
    if (!activeClass?.id) { setError('Seleccioná una clase para asociar el recurso.'); return; }

    setIsSubmitting(true);
    let progress = 0;
    const interval = setInterval(() => {
      progress += Math.random() * 30;
      if (progress >= 100) {
        progress = 100;
        clearInterval(interval);

        const iconMap = { Manuales: '📘', Planos: '📐', Software: '💾', Tutoriales: '📄' };
        const result = addResource({
          classId: activeClass.id,
          title: title.trim(),
          category,
          type: 'PDF',
          size: formatFileSize(selectedFile.size),
          icon: iconMap[category] || '📄',
          fileName: selectedFile.name,
          fileData: selectedFile.data,
        });

        setIsSubmitting(false);
        if (result.success) {
          setSuccess(true);
          setTimeout(handleClose, 1500);
        } else {
          setError(result.error || 'Error al guardar el recurso.');
        }
      }
      setUploadProgress(progress);
    }, 200);
  };

  if (!isOpen && !closing) return null;

  return (
    <div className={`modal-overlay ${closing ? 'modal-closing' : ''}`} onClick={handleClose}>
      <div className={`modal-card ${closing ? 'modal-card-closing' : ''}`} onClick={e => e.stopPropagation()}>

        <div className="modal-header">
          <div className="modal-header-info">
            <div className="modal-header-icon"><BookOpen size={24} /></div>
            <div>
              <h2 className="modal-title">Subir Recurso Técnico</h2>
              <p className="modal-subtitle">
                {activeClass ? `Para ${activeClass.materia}` : 'Seleccioná una clase'}
              </p>
            </div>
          </div>
          <button className="modal-close-btn" onClick={handleClose}><X size={20} /></button>
        </div>

        {success ? (
          <div className="modal-success">
            <div className="success-icon-wrapper"><CheckCircle2 size={48} /></div>
            <h3>¡Recurso añadido!</h3>
            <p className="success-preview">{title}.pdf</p>
          </div>
        ) : (
          <form className="modal-form" onSubmit={handleSubmit}>

            {/* Class selector — only shown when multiple classes are passed in */}
            {!currentClass && classesProp && classesProp.length > 0 && (
              <div className="form-field">
                <label><Layers size={16} className="label-icon" /> Clase de destino</label>
                <select
                  value={selectedClassId}
                  onChange={e => setSelectedClassId(e.target.value)}
                  style={{
                    background: 'rgba(0,0,0,0.2)',
                    border: '1px solid rgba(255,255,255,0.1)',
                    padding: '14px', borderRadius: '12px', color: 'white'
                  }}
                >
                  {classesProp.map(c => (
                    <option key={c.id} value={c.id}>
                      {c.materia} – {c.curso} {c.division}
                    </option>
                  ))}
                </select>
              </div>
            )}

            {/* File Drop Zone */}
            <div className="form-field">
              <label><UploadCloud size={16} className="label-icon" /> Archivo PDF</label>
              {!selectedFile ? (
                <div
                  className={`upload-dropzone ${isDragging ? 'drag-active' : ''}`}
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                  onClick={() => fileInputRef.current.click()}
                >
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileChange}
                    accept=".pdf"
                    style={{ display: 'none' }}
                  />
                  <div className="upload-icon-wrapper"><UploadCloud size={28} /></div>
                  <div className="upload-text">
                    <h4>Arrastrá tu PDF aquí</h4>
                    <p>o <span className="highlight">explorá tus archivos</span></p>
                  </div>
                </div>
              ) : (
                <div className="file-selected-strip">
                  <div className="file-icon"><File size={20} /></div>
                  <div className="file-details">
                    <span className="file-name">{selectedFile.name}</span>
                    <span className="file-size">{formatFileSize(selectedFile.size)}</span>
                  </div>
                  {!isSubmitting && (
                    <button type="button" className="remove-file-btn" onClick={() => setSelectedFile(null)}>
                      <Trash2 size={16} />
                    </button>
                  )}
                </div>
              )}
            </div>

            {/* Title */}
            <div className="form-field">
              <label><Type size={16} className="label-icon" /> Nombre del Recurso</label>
              <input
                type="text"
                placeholder="Ej: Manual de Robótica I"
                style={{
                  background: 'rgba(0,0,0,0.2)',
                  border: '1px solid rgba(255,255,255,0.1)',
                  padding: '14px', borderRadius: '12px', color: 'white'
                }}
                value={title}
                onChange={e => setTitle(e.target.value)}
              />
            </div>

            {/* Category */}
            <div className="form-row">
              <div className="form-field">
                <label><Tag size={16} className="label-icon" /> Categoría</label>
                <select
                  value={category}
                  onChange={e => setCategory(e.target.value)}
                  style={{
                    background: 'rgba(0,0,0,0.2)',
                    border: '1px solid rgba(255,255,255,0.1)',
                    padding: '14px', borderRadius: '12px', color: 'white'
                  }}
                >
                  {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                </select>
              </div>
              <div className="form-field">
                <label><FileText size={16} className="label-icon" /> Tipo detectado</label>
                <div style={{
                  background: 'rgba(0,0,0,0.1)',
                  border: '1px solid rgba(139, 92, 246, 0.2)',
                  padding: '14px', borderRadius: '12px',
                  color: '#8b5cf6', fontWeight: '700', fontSize: '14px'
                }}>PDF</div>
              </div>
            </div>

            {/* Progress */}
            {isSubmitting && (
              <div className="upload-progress-container">
                <span className="progress-text">Subiendo archivo... {Math.round(uploadProgress)}%</span>
                <div className="progress-bar-bg">
                  <div className="progress-bar-fill" style={{ width: `${uploadProgress}%` }} />
                </div>
              </div>
            )}

            {/* Error */}
            {error && (
              <div className="modal-error">
                <AlertCircle size={18} /><span>{error}</span>
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
