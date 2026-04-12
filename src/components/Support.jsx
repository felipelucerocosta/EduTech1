import React, { useState } from 'react';
import { HelpCircle, Mail, MessageSquare, Book, ChevronRight, Send, CheckCircle } from 'lucide-react';
import './Support.css';

const Support = () => {
  const [submitted, setSubmitted] = useState(false);
  const [activeCard, setActiveCard] = useState(null);

  const faqs = [
    {
      q: '¿Cómo subo mis planos de AutoCAD?',
      a: 'Debes dirigirte a la sección de la clase, seleccionar la tarea correspondiente y arrastrar tu archivo .dwg al área de entrega.'
    },
    {
      q: '¿Dónde encuentro el software de simulación?',
      a: 'Toda la herramental digital está disponible en la sección de "Recursos" bajo la categoría "Software".'
    },
    {
      q: '¿Cómo recupero mi contraseña institucional?',
      a: 'Por favor, contacta al administrador del laboratorio o envía un ticket a través de este portal.'
    }
  ];

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 3000);
  };

  return (
    <div className="support-container">
      <div className="support-header">
        <h1 className="page-title">Soporte Técnico</h1>
        <div className="title-divider"></div>
        <p className="page-subtitle">¿Necesitas ayuda con la plataforma? Estamos aquí para asistirte.</p>
      </div>

      <div className="support-actions-grid">
        {[
          { id: 'tickets', icon: Mail, title: 'Centro de Tickets', desc: 'Envíanos tu consulta técnica' },
          { id: 'chat', icon: MessageSquare, title: 'Chat en Vivo', desc: 'Disponible Lun-Vie 8:00 - 18:00' },
          { id: 'docs', icon: Book, title: 'Documentación', desc: 'Guías de uso de la plataforma' }
        ].map((card) => (
          <button 
            key={card.id} 
            className={`support-card-mini ${activeCard === card.id ? 'active' : ''}`}
            onClick={() => setActiveCard(card.id)}
          >
            <div className="support-icon purple"><card.icon size={24} /></div>
            <div className="support-mini-info">
              <h3>{card.title}</h3>
              <p>{card.desc}</p>
            </div>
            <ChevronRight size={18} className="arrow" />
          </button>
        ))}
      </div>

      <div className="support-main-columns">
        <div className="support-faq-column">
          <h2 className="section-title">Preguntas Frecuentes</h2>
          <div className="faq-list">
            {faqs.map((faq, index) => (
              <div key={index} className="faq-item">
                <div className="faq-question">
                  <HelpCircle size={18} />
                  <span>{faq.q}</span>
                </div>
                <p className="faq-answer">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="support-form-column">
          <div className="contact-form-glass">
            <h2 className="section-title">Enviar Mensaje</h2>
            {submitted ? (
              <div className="form-success-alert">
                <CheckCircle size={40} />
                <h3>Ticket Enviado</h3>
                <p>Te responderemos a la brevedad en tu correo institucional.</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="support-form-logic">
                <div className="form-group-tech">
                  <label>Asunto</label>
                  <input type="text" placeholder="Ej: Error al subir archivo..." required />
                </div>
                <div className="form-group-tech">
                  <label>Descripción del Problema</label>
                  <textarea placeholder="Cuéntanos más detalles..." required></textarea>
                </div>
                <button type="submit" className="btn-send-tech">
                  <span>Enviar Ticket</span>
                  <Send size={18} />
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Support;

