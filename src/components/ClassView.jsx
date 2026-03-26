import React from 'react';
import { Settings, MessageCircle, Heart, ThumbsUp, MoreHorizontal, FileText, Send } from 'lucide-react';
import './ClassView.css';

const ClassView = () => {
  return (
    <div className="class-view-container">
      <div className="class-header-card">
        <div className="class-header-icon">
          <Settings size={40} color="white" />
        </div>
        <div className="class-header-info">
          <h2 className="class-view-title">ROBÓTICA AVANZADA</h2>
          <h3 className="class-view-subtitle">FORO DE DISCUSIÓN / EL TABLÓN</h3>
        </div>
      </div>

      <div className="class-content-layout">
        <div className="forum-main-column">
          
          <div className="add-post-card">
            <div className="user-avatar">
              <img src="https://ui-avatars.com/api/?name=User&background=0D8ABC&color=fff" alt="User" />
            </div>
            <div className="post-input-wrapper">
              <input type="text" placeholder="Añadir publicación... (Comparte tus dudas o proyectos)" />
              <button className="btn-share">Comparte</button>
            </div>
          </div>

          <div className="post-card">
            <div className="post-header">
              <div className="post-author">
                <div className="user-avatar small">
                  <img src="https://ui-avatars.com/api/?name=JP&background=0D8ABC&color=fff" alt="Juan Pérez" />
                </div>
                <div className="post-title-area">
                  <h4 className="post-title">[Duda] Sobre el algoritmo de evasión de obstáculos de la Práctica 3</h4>
                </div>
              </div>
              <button className="action-btn"><MoreHorizontal size={20} /></button>
            </div>
            <div className="post-body">
              <p>[Duda] sobre el algoritmo de evasión de obstáculos de la práctica 3 con código a de evolución contra de commento:</p>
              <div className="code-block">
                <pre>
{`void max() {
  print(.snog("stats.0");
}`}
                </pre>
              </div>
              <p>Cunsto se dia worlechta a proplemas?</p>
            </div>
            <div className="post-footer">
              <button className="footer-action"><MessageCircle size={16} /> Comentario</button>
              <button className="footer-action"><Heart size={16} /> 1</button>
              <div className="spacer"></div>
              <button className="footer-action"><ThumbsUp size={16} /></button>
            </div>
          </div>

          <div className="post-card">
            <div className="post-header">
              <div className="post-author">
                <div className="user-avatar small">
                  <img src="https://ui-avatars.com/api/?name=ML&background=F56565&color=fff" alt="María López" />
                </div>
                <div className="post-title-area">
                  <h4 className="post-title">[Proyecto] Avance del prototipo de brazo robótico controlado por ESP32</h4>
                </div>
              </div>
              <button className="action-btn"><MoreHorizontal size={20} /></button>
            </div>
            <div className="post-body">
              <p>Proyecto) Avance del prototipo de brazo robótico controlado por ESP32. Saban una pontanada en munso complade pela munda de ebalecir.</p>
              <div className="post-images">
                <div className="image-placeholder">
                  {/* Mock image presentation */}
                  <div className="robot-arm-mock" style={{background: '#333'}}>🤖</div>
                </div>
                <div className="image-placeholder">
                  <div className="robot-arm-mock" style={{background: '#444'}}>⚙️</div>
                </div>
              </div>
            </div>
            <div className="post-footer">
              <button className="footer-action"><MessageCircle size={16} /> Comentario</button>
              <button className="footer-action"><Heart size={16} /> 5</button>
              <div className="spacer"></div>
              <button className="footer-action"><ThumbsUp size={16} /></button>
            </div>
          </div>

        </div>

        <div className="forum-side-column">
          <div className="side-widget">
            <h4 className="widget-title">MIEMBROS DE LA CLASE</h4>
            <div className="members-list">
              {[1, 2, 3, 4].map(i => (
                <div key={i} className="member-item">
                  <div className="user-avatar small">
                    <img src={`https://ui-avatars.com/api/?name=Juan+Pérez&background=E2E8F0&color=333`} alt="Juan Pérez" />
                  </div>
                  <span className="member-name">Juan Pérez</span>
                </div>
              ))}
            </div>
          </div>

          <div className="side-widget mt-20">
            <h4 className="widget-title">RECURSOS CLAVE</h4>
            <div className="resources-list">
              <a href="#" className="resource-item">
                <FileText size={16} className="resource-icon" />
                <span>Recursos de clase</span>
              </a>
              <a href="#" className="resource-item">
                <FileText size={16} className="resource-icon" />
                <span>Recursos de nro 2</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ClassView;
