import React from 'react';
import { Mail, Lock } from 'lucide-react';
import AlfredChat from './AlfredChat';
import './Login.css';

const Login = ({ onLogin }) => {
  const handleSubmit = (e) => {
    e.preventDefault();
    onLogin();
  };

  return (
    <div className="login-container">
      {/* Left section - Branding/Illustration */}
      <div className="login-branding">
        <div className="branding-content">
          <div className="logo-container">
            <div className="logo-icon-large">
              <span className="logo-text-et">ET</span>
              <div className="circuit-lines"></div>
            </div>
            <h1>Edu-Tech: <br /> Plataforma Técnica</h1>
            <p className="subtitle">Tu Portal al Futuro Técnico.<br/>Accede a cursos, proyectos y herramientas.</p>
          </div>
        </div>
        
        {/* Background decorative elements */}
        <div className="decoration-circle top-right"></div>
        <div className="decoration-circle bottom-left"></div>
      </div>

      {/* Right section - Login Form */}
      <div className="login-form-section">
        <div className="form-container">
          <h2 className="form-title">INICIAR SESIÓN</h2>

          <form onSubmit={handleSubmit}>
            <div className="input-group">
              <label>Mail Institucional</label>
              <div className="input-with-icon">
                <Mail className="input-icon" size={18} />
                <input type="email" placeholder="ejemplo@alu.tecnica29de6.edu.ar" required />
              </div>
            </div>

            <div className="input-group">
              <label>Contraseña</label>
              <div className="input-with-icon">
                <Lock className="input-icon" size={18} />
                <input type="password" placeholder="•••••••••" required />
              </div>
            </div>

            <button type="submit" className="btn-primary" style={{marginTop: '20px'}}>
              ENTRAR <span>&rarr;</span>
            </button>
          </form>

          <div className="form-footer">
            Soporte Técnico | Términos y Privacidad | © 2024 Edu-Tech
          </div>
        </div>
      </div>

      <AlfredChat />
    </div>
  );
};

export default Login;
