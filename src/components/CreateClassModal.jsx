import React, { useState, useEffect } from 'react';
import { X, BookOpen, GraduationCap, Clock, Hash, AlertCircle, CheckCircle2, Loader2 } from 'lucide-react';
import { useAppContext } from '../context/AppContext';
import './CreateClassModal.css';

const MATERIAS = [
  'Matemática',
  'Lengua y Literatura',
  'Historia',
  'Geografía',
  'Física',
  'Química',
  'Biología',
  'Educación Física',
  'Robótica',
  'Programación',
  'Base de Datos',
  'Redes',
  'Electrónica',
  'Electrotecnia',
  'Microcontroladores',
  'Circuitos Digitales',
  'Taller de Mecánica',
  'Taller Eléctrico',
  'Dibujo Técnico',
  'Inglés Técnico',
  'Educación Física',
  'Laboratorio',
];

const CURSOS = ['1ro', '2do', '3ro', '4to', '5to', '6to', '7mo'];
const DIVISIONES = ['1ra', '2da', '3ra', '4ta', '5ta', '6ta', '7ma', '8va', '9na', '10ma'];
const TURNOS = ['Mañana', 'Tarde', 'Noche'];

const MATERIA_ICONS = {
  'Matemática': '📐',
  'Lengua y Literatura': '📖',
  'Historia': '🏛️',
  'Geografía': '🌍',
  'Física': '⚛️',
  'Química': '🧪',
  'Biología': '🧬',
  'Educación Tecnológica': '🔧',
  'Robótica': '🤖',
  'Programación': '💻',
  'Base de Datos': '🗃️',
  'Redes y Telecomunicaciones': '🌐',
  'Electrónica': '🔌',
  'Electrotecnia': '⚡',
  'Microcontroladores': '🎛️',
  'Circuitos Digitales': '🔲',
  'Taller de Mecánica': '🔩',
  'Taller Eléctrico': '💡',
  'Dibujo Técnico': '📏',
  'Inglés Técnico': '🇬🇧',
  'Educación Física': '🏃',
  'Laboratorio': '🔬',
};

const CreateClassModal = ({ isOpen, onClose }) => {
  const { addClass, classes } = useAppContext();
  const [materia, setMateria] = useState('');
  const [curso, setCurso] = useState('');
  const [division, setDivision] = useState('');
  const [turno, setTurno] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [closing, setClosing] = useState(false);

  // Check uniqueness in real-time
  useEffect(() => {
    if (materia && curso && division && turno) {
      const key = `${materia}|${curso}|${division}|${turno}`.toLowerCase();
      const exists = classes.some(
        (c) => `${c.materia}|${c.curso}|${c.division}|${c.turno}`.toLowerCase() === key
      );
      if (exists) {
        setError(`Ya existe "${materia} – ${curso} ${division} – Turno ${turno}".`);
      } else {
        setError('');
      }
    } else {
      setError('');
    }
  }, [materia, curso, division, turno, classes]);

  const handleClose = () => {
    setClosing(true);
    setTimeout(() => {
      setClosing(false);
      setMateria('');
      setCurso('');
      setDivision('');
      setTurno('');
      setError('');
      setSuccess(false);
      onClose();
    }, 250);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!materia || !curso || !division || !turno) {
      setError('Completá todos los campos.');
      return;
    }
    if (error) return; // duplicate exists

    setIsSubmitting(true);
    setTimeout(() => {
      const result = addClass({ materia, curso, division, turno });
      setIsSubmitting(false);
      if (result.success) {
        setSuccess(true);
        setTimeout(() => handleClose(), 1200);
      } else {
        setError(result.error);
      }
    }, 600);
  };

  if (!isOpen && !closing) return null;

  const isFormComplete = materia && curso && division && turno;
  const classPreview = isFormComplete ? `${materia} – ${curso} ${division} – Turno ${turno}` : null;

  return (
    <div className={`modal-overlay ${closing ? 'modal-closing' : ''}`} onClick={handleClose}>
      <div className={`modal-card ${closing ? 'modal-card-closing' : ''}`} onClick={(e) => e.stopPropagation()}>
        
        {/* Header */}
        <div className="modal-header">
          <div className="modal-header-info">
            <div className="modal-header-icon">
              <BookOpen size={24} />
            </div>
            <div>
              <h2 className="modal-title">Crear Nueva Clase</h2>
              <p className="modal-subtitle">Configurá la materia, curso y turno</p>
            </div>
          </div>
          <button className="modal-close-btn" onClick={handleClose} aria-label="Cerrar modal">
            <X size={20} />
          </button>
        </div>

        {/* Success state */}
        {success ? (
          <div className="modal-success">
            <div className="success-icon-wrapper">
              <CheckCircle2 size={48} />
            </div>
            <h3>¡Clase creada con éxito!</h3>
            <p className="success-preview">{classPreview}</p>
          </div>
        ) : (
          <form className="modal-form" onSubmit={handleSubmit}>
            {/* Materia */}
            <div className="form-field">
              <label htmlFor="materia-select">
                <BookOpen size={16} className="label-icon" />
                Materia
              </label>
              <select
                id="materia-select"
                value={materia}
                onChange={(e) => setMateria(e.target.value)}
                disabled={isSubmitting}
              >
                <option value="">Seleccioná una materia</option>
                {MATERIAS.map((m) => (
                  <option key={m} value={m}>{MATERIA_ICONS[m] || '📘'} {m}</option>
                ))}
              </select>
            </div>

            {/* Curso + División row */}
            <div className="form-row">
              <div className="form-field">
                <label htmlFor="curso-select">
                  <GraduationCap size={16} className="label-icon" />
                  Curso
                </label>
                <select
                  id="curso-select"
                  value={curso}
                  onChange={(e) => setCurso(e.target.value)}
                  disabled={isSubmitting}
                >
                  <option value="">Curso</option>
                  {CURSOS.map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>

              <div className="form-field">
                <label htmlFor="division-select">
                  <Hash size={16} className="label-icon" />
                  División
                </label>
                <select
                  id="division-select"
                  value={division}
                  onChange={(e) => setDivision(e.target.value)}
                  disabled={isSubmitting}
                >
                  <option value="">División</option>
                  {DIVISIONES.map((d) => (
                    <option key={d} value={d}>{d}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Turno */}
            <div className="form-field">
              <label htmlFor="turno-select">
                <Clock size={16} className="label-icon" />
                Turno
              </label>
              <div className="turno-options">
                {TURNOS.map((t) => (
                  <button
                    key={t}
                    type="button"
                    className={`turno-chip ${turno === t ? 'active' : ''}`}
                    onClick={() => setTurno(t)}
                    disabled={isSubmitting}
                  >
                    {t === 'Mañana' ? '🌅' : t === 'Tarde' ? '🌤️' : '🌙'} {t}
                  </button>
                ))}
              </div>
            </div>

            {/* Preview */}
            {classPreview && !error && (
              <div className="class-preview">
                <span className="preview-label">Vista previa:</span>
                <span className="preview-value">{classPreview}</span>
              </div>
            )}

            {/* Error */}
            {error && (
              <div className="modal-error">
                <AlertCircle size={18} />
                <span>{error}</span>
              </div>
            )}

            {/* Submit */}
            <button
              type="submit"
              className={`modal-submit-btn ${isSubmitting ? 'submitting' : ''}`}
              disabled={!isFormComplete || !!error || isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <Loader2 size={20} className="spinner" />
                  <span>Creando...</span>
                </>
              ) : (
                <>
                  <BookOpen size={20} />
                  <span>Crear Clase</span>
                </>
              )}
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default CreateClassModal;
