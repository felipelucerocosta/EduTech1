import React, { useState } from 'react';
import { Search, Download, ExternalLink, Inbox, Plus, Upload, BookOpen } from 'lucide-react';
import { useAppContext } from '../context/AppContext';
import AddResourceModal from './AddResourceModal';
import './Resources.css';

const Resources = () => {
  const { resources, currentUser, classes } = useAppContext();
  const [searchTerm, setSearchTerm] = useState('');
  const [activeCategory, setActiveCategory] = useState('Todos');
  const [downloadingId, setDownloadingId] = useState(null);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [selectedClassId, setSelectedClassId] = useState('');

  const isProfesor = currentUser?.role === 'profesor';
  const profesorClasses = isProfesor
    ? classes.filter(c => c.profesorEmail === currentUser?.email)
    : [];
  // Always resolve to a class: first prefer explicitly selected, then fallback to first class
  const activeClassId = selectedClassId || profesorClasses[0]?.id || null;
  const selectedClass = profesorClasses.find(c => c.id === activeClassId) || null;

  const categories = ['Todos', 'Manuales', 'Planos', 'Software', 'Tutoriales'];

  const handleDownload = (res) => {
    if (!res.fileData) return;
    setDownloadingId(res.id);
    const link = document.createElement('a');
    link.href = res.fileData;
    link.download = res.fileName || res.title;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    setTimeout(() => setDownloadingId(null), 1000);
  };

  const filteredResources = resources.filter(res => {
    const matchesSearch = res.title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = activeCategory === 'Todos' || res.category === activeCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="resources-container animate-fade-in">
      <div className="resources-header">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '16px' }}>
          <div>
            <h1 className="page-title">Recursos Técnicos</h1>
            <div className="title-divider"></div>
            <p className="page-subtitle">Accede a manuales, planos y software especializado</p>
          </div>
          {isProfesor && (
            <div style={{ display: 'flex', gap: '12px', alignItems: 'center', flexWrap: 'wrap' }}>
              {profesorClasses.length > 1 && (
                <select
                  value={selectedClassId || (profesorClasses[0]?.id ?? '')}
                  onChange={e => setSelectedClassId(e.target.value)}
                  style={{
                    background: 'rgba(15, 23, 42, 0.8)',
                    border: '1px solid rgba(255,255,255,0.1)',
                    borderRadius: '12px',
                    color: 'white',
                    padding: '10px 16px',
                    fontSize: '14px',
                    cursor: 'pointer',
                  }}
                >
                  {profesorClasses.map(c => (
                    <option key={c.id} value={c.id}>{c.materia} – {c.curso} {c.division}</option>
                  ))}
                </select>
              )}
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
            </div>
          )}
        </div>
      </div>

      <div className="resources-toolbar">
        <div className="search-box-tech">
          <Search size={18} />
          <input 
            type="text" 
            placeholder="Buscar recursos técnicos..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="filter-chips">
          {categories.map(cat => (
            <button 
              key={cat}
              className={`filter-chip ${activeCategory === cat ? 'active' : ''}`}
              onClick={() => setActiveCategory(cat)}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      <div className="resources-grid">
        {resources.length === 0 ? (
          <div className="empty-state" style={{gridColumn: '1 / -1', marginTop: '40px'}}>
            <Inbox size={48} color="var(--text-dim)" style={{marginBottom: '16px'}} />
            <h3>No hay recursos disponibles</h3>
            <p className="page-subtitle">Los materiales aparecerán cuando un profesor los suba.</p>
          </div>
        ) : filteredResources.length === 0 ? (
            <div className="empty-state" style={{gridColumn: '1 / -1', marginTop: '40px'}}>
                <h3>No se encontraron resultados</h3>
                <p className="page-subtitle">Ajustá los filtros o la búsqueda.</p>
            </div>
        ) : (
          filteredResources.map((res) => (
            <div key={res.id} className={`resource-card ${downloadingId === res.id ? 'downloading' : ''}`}>
              <div className="resource-top">
                <div className="resource-icon-box">{res.icon || '📦'}</div>
                <div className="resource-type-badge">{res.type}</div>
              </div>
              <div className="resource-body">
                <h3 className="resource-title">{res.title}</h3>
                <span className="resource-category">{res.category}</span>
              </div>
              <div className="resource-footer">
                <span className="resource-size">{downloadingId === res.id ? 'Descargando...' : res.size}</span>
                <div className="resource-actions">
                  <button 
                    className={`res-btn icon ${downloadingId === res.id ? 'active' : ''}`}
                    onClick={() => handleDownload(res)}
                    title="Descargar"
                  >
                    <Download size={16} />
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Upload Resource Modal - renders whenever showUploadModal is true */}
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

export default Resources;
