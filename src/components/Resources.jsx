import React, { useState } from 'react';
import { Search, BookOpen, Download, ExternalLink, Filter } from 'lucide-react';
import './Resources.css';

const Resources = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeCategory, setActiveCategory] = useState('Todos');
  const [downloadingId, setDownloadingId] = useState(null);

  const categories = ['Todos', 'Manuales', 'Planos', 'Software', 'Tutoriales'];
  const resources = [
    { id: 1, title: 'Manual de AutoCAD 2024 - Avanzado', type: 'PDF', category: 'Manuales', size: '12.4 MB', icon: '📘' },
    { id: 2, title: 'Esquema de Tablero Principal Técnica 29', type: 'DWG', category: 'Planos', size: '2.8 MB', icon: '📐' },
    { id: 3, title: 'Simulador de Circuitos Logisim-evolution', type: 'EXE', category: 'Software', size: '85 MB', icon: '💾' },
    { id: 4, title: 'Guía de Programación en PLC Siemens', type: 'PDF', category: 'Tutoriales', size: '5.1 MB', icon: '📠' }
  ];

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
    <div className="resources-container">
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
        {filteredResources.map((res) => (
          <div key={res.id} className={`resource-card ${downloadingId === res.id ? 'downloading' : ''}`}>
            <div className="resource-top">
              <div className="resource-icon-box">{res.icon}</div>
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
        ))}
      </div>
    </div>
  );
};

export default Resources;
