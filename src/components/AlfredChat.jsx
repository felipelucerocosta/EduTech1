import React, { useState, useRef, useEffect } from 'react';
import { Bot, Send, X, MessageCircle } from 'lucide-react';
import './AlfredChat.css';

const AlfredChat = ({ openSignal }) => {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    if (openSignal > 0) setIsOpen(true);
  }, [openSignal]);
  const [messages, setMessages] = useState([
    { role: 'alfred', text: 'Buenas, dame tu mail institucional para ayudarte a iniciar sesión, ¿cuál es tu mail?' }
  ]);
  const [inputValue, setInputValue] = useState('');
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isOpen]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!inputValue.trim()) return;

    const userMessage = inputValue.trim();
    setMessages(prev => [...prev, { role: 'user', text: userMessage }]);
    setInputValue('');

    // Simulated Alfred AI logic
    setTimeout(() => {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(userMessage)) {
        setMessages(prev => [...prev, { role: 'alfred', text: 'Por favor, ingresa un formato de correo válido.' }]);
      } else if (userMessage.includes('.edu.ar')) {
        setMessages(prev => [...prev, { role: 'alfred', text: 'Mail admitido. Se ha enviado un correo postal a tu bandeja para poder ingresar tu contraseña.' }]);
      } else {
        setMessages(prev => [...prev, { role: 'alfred', text: 'Ese no es un mail admitido. Por favor, ingresa tu correo institucional.' }]);
      }
    }, 600);
  };

  return (
    <>
      <button 
        className={`alfred-fab ${isOpen ? 'hidden' : ''}`} 
        onClick={() => setIsOpen(true)}
        aria-label="Abrir Chat de Alfred"
      >
        <MessageCircle size={28} />
      </button>

      {isOpen && (
        <div className="alfred-chat-window">
          <div className="alfred-chat-header">
            <div className="alfred-title">
              <Bot size={20} />
              <span>Alfred AI</span>
            </div>
            <button className="close-btn" onClick={() => setIsOpen(false)}>
              <X size={20} />
            </button>
          </div>
          
          <div className="alfred-messages-container">
            {messages.map((msg, idx) => (
              <div key={idx} className={`chat-bubble-wrapper ${msg.role}`}>
                {msg.role === 'alfred' && (
                  <div className="chat-avatar">
                    <Bot size={16} />
                  </div>
                )}
                <div className={`chat-bubble ${msg.role}`}>
                  {msg.text}
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          <form className="alfred-chat-input" onSubmit={handleSubmit}>
            <input 
              type="text" 
              placeholder="Escribe tu correo..." 
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
            />
            <button type="submit" disabled={!inputValue.trim()}>
              <Send size={18} />
            </button>
          </form>
        </div>
      )}
    </>
  );
};

export default AlfredChat;
