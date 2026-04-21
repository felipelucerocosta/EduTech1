import React, { useState } from 'react';
import { 
  ChevronLeft, ChevronRight, Plus, X, 
  Clock, MapPin, AlignLeft, Hash, Trash2, Calendar as CalendarIcon 
} from 'lucide-react';
import { useAppContext } from '../context/AppContext';
import './Calendar.css';

const Calendar = ({ classId }) => {
  const { events, tasks, addEvent, deleteEvent } = useAppContext();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);
  const [eventTitle, setEventTitle] = useState('');
  const [eventType, setEventType] = useState('Tarea'); // 'Tarea', 'Exposición', 'Prueba'

  // Calendar Logic
  const daysInMonth = (year, month) => new Date(year, month + 1, 0).getDate();
  const firstDayOfMonth = (year, month) => new Date(year, month, 1).getDay();

  const prevMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  };

  const nextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
  };

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  const monthName = currentDate.toLocaleString('es-ES', { month: 'long' });
  const totalDays = daysInMonth(year, month);
  const startDay = firstDayOfMonth(year, month);

  // Pad days
  const days = [];
  const prevMonthDays = daysInMonth(year, month - 1);
  for (let i = startDay - 1; i >= 0; i--) {
    days.push({ day: prevMonthDays - i, currentMonth: false });
  }
  for (let i = 1; i <= totalDays; i++) {
    days.push({ day: i, currentMonth: true });
  }
  const remainingSlots = 42 - days.length;
  for (let i = 1; i <= remainingSlots; i++) {
    days.push({ day: i, currentMonth: false });
  }

  const handleDayClick = (dayObj) => {
    if (!dayObj.currentMonth) return;
    const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(dayObj.day).padStart(2, '0')}`;
    setSelectedDate(dateStr);
    setShowAddModal(true);
  };

  const handleAddEvent = (e) => {
    e.preventDefault();
    if (!eventTitle) return;

    addEvent({
      title: eventTitle,
      date: selectedDate,
      type: eventType,
      classId: classId,
      color: eventType === 'Prueba' ? '#ef4444' : eventType === 'Exposición' ? '#10b981' : '#6366f1'
    });

    setEventTitle('');
    setShowAddModal(false);
  };

  const getEventsForDay = (day, isCurrentMonth) => {
    if (!isCurrentMonth) return [];
    const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    
    const dayEvents = events.filter(e => e.date === dateStr && e.classId === classId);
    const dayTasks = tasks.filter(t => t.dueDate === dateStr && t.classId === classId).map(t => ({
      ...t,
      isTask: true,
      color: '#f59e0b'
    }));

    return [...dayEvents, ...dayTasks];
  };

  const weekDays = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];

  return (
    <div className="calendar-view-container animate-fade-in">
      <div className="calendar-header">
        <div className="calendar-nav">
          <button className="nav-btn" onClick={prevMonth}><ChevronLeft size={20} /></button>
          <h2 className="current-month">{monthName.toUpperCase()} {year}</h2>
          <button className="nav-btn" onClick={nextMonth}><ChevronRight size={20} /></button>
        </div>
        <div className="calendar-actions">
           <button className="btn-primary" onClick={() => {
             setSelectedDate(new Date().toISOString().split('T')[0]);
             setShowAddModal(true);
           }}>
             <Plus size={18} /> <span>AGENDAR</span>
           </button>
        </div>
      </div>

      <div className="calendar-grid-header">
        {weekDays.map(d => <div key={d} className="weekday-label">{d}</div>)}
      </div>

      <div className="calendar-grid">
        {days.map((d, index) => {
          const dayEvents = getEventsForDay(d.day, d.currentMonth);
          const isToday = d.currentMonth && d.day === new Date().getDate() && month === new Date().getMonth() && year === new Date().getFullYear();
          
          return (
            <div 
              key={index} 
              className={`calendar-day ${d.currentMonth ? 'current' : 'other'} ${isToday ? 'today' : ''}`}
              onClick={() => handleDayClick(d)}
            >
              <span className="day-number">{d.day}</span>
              <div className="day-events">
                {dayEvents.slice(0, 3).map((ev, i) => (
                  <div 
                    key={ev.id || i} 
                    className="event-dot-wrapper"
                    title={`${ev.type}: ${ev.title}`}
                  >
                    <div className="event-dot" style={{ background: ev.color }}></div>
                    <span className="event-mini-title">{ev.title}</span>
                  </div>
                ))}
                {dayEvents.length > 3 && (
                  <div className="more-events">+{dayEvents.length - 3} más</div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Add Event Modal */}
      {showAddModal && (
        <div className="modal-overlay" onClick={() => setShowAddModal(false)}>
          <div className="modal-card" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <div className="modal-header-info">
                <div className="modal-header-icon">
                  <CalendarIcon size={24} />
                </div>
                <div>
                  <h2 className="modal-title">Agendar Actividad</h2>
                  <p className="modal-subtitle">Fecha: {selectedDate}</p>
                </div>
              </div>
              <button className="modal-close-btn" onClick={() => setShowAddModal(false)}>
                <X size={20} />
              </button>
            </div>

            <form className="modal-form" onSubmit={handleAddEvent}>
              <div className="form-field">
                <label><AlignLeft size={16} className="label-icon" /> Título / Materia</label>
                <input 
                  type="text" 
                  autoFocus
                  placeholder="Ej: Prueba de Geometría"
                  value={eventTitle}
                  onChange={e => setEventTitle(e.target.value)}
                  style={{
                    background: 'rgba(0,0,0,0.2)', border: '1px solid rgba(255,255,255,0.1)', 
                    padding: '14px', borderRadius: '12px', color: 'white'
                   }}
                />
              </div>

              <div className="form-field">
                <label><Hash size={16} className="label-icon" /> Tipo de Actividad</label>
                <div className="type-options">
                  <button 
                    type="button" 
                    className={`type-chip ${eventType === 'Tarea' ? 'active' : ''}`}
                    onClick={() => setEventType('Tarea')}
                  >Tarea</button>
                  <button 
                    type="button" 
                    className={`type-chip ${eventType === 'Exposición' ? 'active' : ''}`}
                    onClick={() => setEventType('Exposición')}
                  >Exposición</button>
                  <button 
                    type="button" 
                    className={`type-chip ${eventType === 'Prueba' ? 'active' : ''}`}
                    onClick={() => setEventType('Prueba')}
                  >Prueba</button>
                </div>
              </div>

              <button type="submit" className="modal-submit-btn">
                Guardar en Calendario
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Calendar;
