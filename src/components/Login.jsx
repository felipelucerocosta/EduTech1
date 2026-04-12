import React, { useState, useEffect } from 'react';
import { Mail, Lock, ArrowRight, Sparkles, Cpu, BookOpen, Eye, EyeOff, CheckCircle2, Loader2, AlertCircle } from 'lucide-react';
import { useAppContext } from '../context/AppContext';
import AlfredChat from './AlfredChat';
import logoImg from '../assets/logo-tecnica.png';
import './Login.css';

const Login = ({ onLogin }) => {
  const { login } = useAppContext();
  const [emailFocus, setEmailFocus] = useState(false);
  const [passFocus, setPassFocus] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isValidEmail, setIsValidEmail] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [openChatSignal, setOpenChatSignal] = useState(0);

  const handleForgotPassword = (e) => {
    e.preventDefault();
    setOpenChatSignal(prev => prev + 1);
  };

  // Email validation effect for UX feedback
  useEffect(() => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    setIsValidEmail(emailRegex.test(email));
  }, [email]);

  // Clear error when user types
  useEffect(() => {
    if (errorMsg) setErrorMsg('');
  }, [email, password]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!email || !password || isLoading) return;
    
    setIsLoading(true);
    setErrorMsg('');
    // Simulate network authentication delay for better UX
    setTimeout(() => {
      const result = login(email, password);
      if (result.success) {
        onLogin();
      } else {
        setErrorMsg(result.error);
        setIsLoading(false);
      }
    }, 1200);
  };

  return (
    <div className="login-container">
      {/* Dynamic Background Elements */}
      <div className="bg-shape bg-teal"></div>
      <div className="bg-shape bg-purple"></div>
      <div className="bg-shape bg-blue"></div>
      <div className="bg-grid"></div>

      {/* Main Content Layout */}
      <div className="login-content">
        
        {/* Left section - Context & Branding */}
        <div className="login-branding">
          <img src={logoImg} alt="Logo Educación Técnica" className="main-logo" />

          <div className="branding-badge" role="status" aria-label="Institución">
            <Sparkles size={16} className="badge-icon" aria-hidden="true" />
            <span>ET 29 de 6 "Reconquista de BS AS"</span>
          </div>
          
          <h1 className="hero-title">
            Edu-Tech: tu Portal al <br/>
            <span className="text-gradient">Futuro Técnico</span>
          </h1>
          
          <p className="hero-subtitle">
            Accede a una plataforma unificada con cursos de vanguardia, proyectos interactivos y herramientas profesionales.
          </p>

          <div className="features-list">
            <div className="feature-item">
              <div className="feature-icon-wrapper"><Cpu size={20} aria-hidden="true" /></div>
              <span>Laboratorios y prácticas avanzadas</span>
            </div>
            <div className="feature-item">
              <div className="feature-icon-wrapper"><BookOpen size={20} aria-hidden="true" /></div>
              <span>Recursos Académicos 24/7</span>
            </div>
          </div>

          {/* Test accounts info */}
          <div className="test-accounts-info">
            <h4>🔑 Cuentas de prueba</h4>
            <div className="test-account">
              <span className="test-role">Profesor:</span>
              <span className="test-cred">profesor@tecnica29.edu.ar / prof1234</span>
            </div>
            <div className="test-account">
              <span className="test-role">Alumno:</span>
              <span className="test-cred">alumno@tecnica29.edu.ar / alu1234</span>
            </div>
          </div>
        </div>

        {/* Right section - Login Form */}
        <div className="login-form-wrapper">
          <div className="glass-card">
            <div className="card-header">
              <h2>Bienvenido de vuelta</h2>
              <p>Inicia sesión en tu cuenta institucional</p>
            </div>

            <form onSubmit={handleSubmit} className="login-form" noValidate>
              <div className={`input-group ${emailFocus ? 'focused' : ''}`}>
                <label htmlFor="emailInput">Correo Institucional</label>
                <div className="input-field">
                  <Mail className="input-icon" size={20} aria-hidden="true" />
                  <input 
                    id="emailInput"
                    type="email" 
                    placeholder="ejemplo@tecnica29.edu.ar" 
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required 
                    onFocus={() => setEmailFocus(true)}
                    onBlur={() => setEmailFocus(false)}
                    disabled={isLoading}
                    aria-invalid={!isValidEmail && email.length > 0}
                  />
                  {isValidEmail && (
                    <div className="input-success-icon" aria-label="Correo válido">
                      <CheckCircle2 size={18} />
                    </div>
                  )}
                </div>
              </div>

              <div className={`input-group ${passFocus ? 'focused' : ''}`}>
                <div className="label-row">
                  <label htmlFor="passInput">Contraseña</label>
                  <a 
                    href="#" 
                    className="forgot-password" 
                    tabIndex={isLoading ? -1 : 0}
                    onClick={handleForgotPassword}
                  >
                    ¿Olvidaste tu contraseña?
                  </a>
                </div>
                <div className="password-input-row">
                  <div className="input-field">
                    <Lock className="input-icon" size={20} aria-hidden="true" />
                    <input 
                      id="passInput"
                      type={showPassword ? "text" : "password"} 
                      placeholder="••••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required 
                      onFocus={() => setPassFocus(true)}
                      onBlur={() => setPassFocus(false)}
                      disabled={isLoading}
                    />
                  </div>
                  <button 
                    type="button" 
                    className="toggle-password-btn-outside"
                    onClick={() => setShowPassword(!showPassword)}
                    aria-label={showPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
                    disabled={isLoading}
                  >
                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
              </div>

              {/* Error message */}
              {errorMsg && (
                <div className="login-error-msg">
                  <AlertCircle size={18} />
                  <span>{errorMsg}</span>
                </div>
              )}

              <button 
                type="submit" 
                className={`submit-btn ${isLoading ? 'loading' : ''}`} 
                disabled={isLoading || !email || !password}
                aria-busy={isLoading}
              >
                {isLoading ? (
                  <>
                    <Loader2 size={20} className="spinner" aria-hidden="true" />
                    <span>Verificando...</span>
                  </>
                ) : (
                  <>
                    <span>Ingresar al Portal</span>
                    <ArrowRight size={20} className="btn-icon" aria-hidden="true" />
                  </>
                )}
              </button>
            </form>

            <div className="card-footer">
              <p>¿Problemas para ingresar? Usa el asistente inteligente.</p>
            </div>
          </div>
        </div>
      </div>

      <AlfredChat openSignal={openChatSignal} />
    </div>
  );
};

export default Login;
