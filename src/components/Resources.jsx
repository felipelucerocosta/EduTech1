import React, { useState } from 'react';
import { Search, Download, ExternalLink, Inbox } from 'lucide-react';
import { useAppContext } from '../context/AppContext';
import './Resources.css';

const Resources = () => {
  const { resources } = useAppContext();
  const [searchTerm, setSearchTerm] = useState('');
  const [activeCategory, setActiveCategory] = useState('Todos');
  const [downloadingId, setDownloadingId] = useState(null);

  const categories = ['Todos', 'Manuales', 'Planos', 'Software', 'Tutoriales'];

  const handleDownload = (id) => {
    setDownloadingId(id);
    setTimeout(() => setDownloadingId(null), 2000);
  };

  const filteredResources = resources.filter(res => {
    const matchesSearch = res.title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = activeCategory === 'Todos' || res.category === activeCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="resources-container animate-fade-in">
      <div className="resources-header">
        <h1 className="page-title">Recursos Técnicos</h1>
        <div className="title-divider"></div>
        <p className="page-subtitle">Accede a manuales, planos y software especializado</p>
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
                    onClick={() => handleDownload(res.id)}
                  >
                    <Download size={16} />
                  </button>
                  <button className="res-btn icon">
                    <ExternalLink size={16} />
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Resources;
