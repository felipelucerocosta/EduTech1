import React, { createContext, useContext, useState, useEffect } from 'react';

// ─── Test accounts ───────────────────────────────────
const TEST_ACCOUNTS = [
  {
    email: 'profesor@tecnica29.edu.ar',
    password: 'prof1234',
    role: 'profesor',
    name: 'Prof. Juan Pérez',
  },
  {
    email: 'alumno@tecnica29.edu.ar',
    password: 'alu1234',
    role: 'alumno',
    name: 'Martín González',
  },
];

// ─── localStorage keys ───────────────────────────────
const KEYS = {
  CLASSES: 'edutech_classes',
  TASKS: 'edutech_tasks',
  RESOURCES: 'edutech_resources',
  MESSAGES: 'edutech_messages',
  EVENTS: 'edutech_events',
  SUBMISSIONS: 'edutech_submissions',
};

// ─── Persistence helpers ─────────────────────────────
const loadFromStorage = (key) => {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
};

const saveToStorage = (key, data) => {
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch (e) {
    console.warn(`[EduTech] No se pudo guardar en localStorage (${key}):`, e.message);
  }
};

/**
 * Strip heavy binary data (fileData) before persisting to localStorage.
 * This prevents QuotaExceededError when storing large PDFs.
 * The actual file data is kept only in React state (memory).
 */
const stripFileData = (items) =>
  items.map(({ fileData, ...rest }) => rest);

// ─── Context ─────────────────────────────────────────
const AppContext = createContext(null);

export function AppProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [classes, setClasses] = useState(() => loadFromStorage(KEYS.CLASSES));
  const [tasks, setTasks] = useState(() => loadFromStorage(KEYS.TASKS));
  const [resources, setResources] = useState(() => loadFromStorage(KEYS.RESOURCES));
  const [messages, setMessages] = useState(() => loadFromStorage(KEYS.MESSAGES));
  const [events, setEvents] = useState(() => loadFromStorage(KEYS.EVENTS));
  const [submissions, setSubmissions] = useState(() => loadFromStorage(KEYS.SUBMISSIONS));

  // Persist all state whenever it changes
  useEffect(() => { saveToStorage(KEYS.CLASSES, classes); }, [classes]);
  useEffect(() => { saveToStorage(KEYS.TASKS, tasks); }, [tasks]);
  // Resources & Submissions: strip fileData before saving to avoid localStorage quota errors
  useEffect(() => { saveToStorage(KEYS.RESOURCES, stripFileData(resources)); }, [resources]);
  useEffect(() => { saveToStorage(KEYS.MESSAGES, messages); }, [messages]);
  useEffect(() => { saveToStorage(KEYS.EVENTS, events); }, [events]);
  useEffect(() => { saveToStorage(KEYS.SUBMISSIONS, stripFileData(submissions)); }, [submissions]);

  /**
   * Auth
   */
  const login = (email, password) => {
    const account = TEST_ACCOUNTS.find(
      (a) => a.email.toLowerCase() === email.toLowerCase() && a.password === password
    );
    if (!account) {
      return { success: false, error: 'Credenciales incorrectas.' };
    }
    const user = { email: account.email, role: account.role, name: account.name };
    setCurrentUser(user);
    return { success: true, user };
  };

  const logout = () => setCurrentUser(null);

  /**
   * Class Management
   */
  const addClass = ({ materia, curso, division, turno }) => {
    const newClass = {
      id: Math.random().toString(36).substr(2, 9),
      materia, curso, division, turno,
      profesor: currentUser?.name || 'Profesor',
      profesorEmail: currentUser?.email || '',
      createdAt: new Date().toISOString(),
      alumnos: currentUser?.role === 'alumno' ? [] : ['María López', 'Carlos Ruiz', 'Sofía Duarte'], // Mock members for now
    };
    setClasses(prev => [...prev, newClass]);
    return { success: true };
  };

  const deleteClass = (classId) => {
    setClasses(prev => prev.filter(c => c.id !== classId));
  };

  /**
   * Task Management
   */
  const addTask = (taskData) => {
    const newTask = {
      id: Math.random().toString(36).substr(2, 9),
      ...taskData,
      creatorEmail: currentUser?.email || '',
      createdAt: new Date().toISOString(),
    };
    setTasks(prev => [...prev, newTask]);
    return { success: true };
  };

  /**
   * Resource Management
   */
  const addResource = (resourceData) => {
    const newResource = {
      id: Math.random().toString(36).substr(2, 9),
      ...resourceData,
      createdAt: new Date().toISOString(),
    };
    setResources(prev => [...prev, newResource]);
    return { success: true };
  };

  /**
   * Message Management
   */
  const addMessage = (msgData) => {
    const newMessage = {
      id: Math.random().toString(36).substr(2, 9),
      ...msgData,
      author: currentUser?.name || 'Usuario',
      authorRole: currentUser?.role || 'alumno',
      timestamp: new Date().toISOString(),
      likes: 0,
    };
    setMessages(prev => [...prev, newMessage]);
    return { success: true };
  };

  /**
   * Event Management (Calendar)
   */
  const addEvent = (eventData) => {
    const newEvent = {
      id: Math.random().toString(36).substr(2, 9),
      ...eventData,
      createdAt: new Date().toISOString(),
    };
    setEvents(prev => [...prev, newEvent]);
    return { success: true };
  };

  const deleteEvent = (eventId) => {
    setEvents(prev => prev.filter(e => e.id !== eventId));
  };

  /**
   * Submission Management (Student Work Delivery)
   */
  const addSubmission = (submissionData) => {
    // Check if already submitted for this task by this user
    const existing = submissions.find(
      s => s.taskId === submissionData.taskId && s.authorEmail === currentUser?.email
    );
    if (existing) {
      // Update existing submission
      setSubmissions(prev => prev.map(s =>
        s.id === existing.id ? { ...s, ...submissionData, updatedAt: new Date().toISOString() } : s
      ));
      return { success: true, updated: true };
    }
    const newSubmission = {
      id: Math.random().toString(36).substr(2, 9),
      ...submissionData,
      authorName: currentUser?.name || 'Alumno',
      authorEmail: currentUser?.email || '',
      submittedAt: new Date().toISOString(),
    };
    setSubmissions(prev => [...prev, newSubmission]);
    return { success: true };
  };

  /**
   * Grade a submission (Professor only)
   */
  const gradeSubmission = (submissionId, grade, feedback) => {
    setSubmissions(prev => prev.map(s =>
      s.id === submissionId
        ? { ...s, grade, feedback, gradedAt: new Date().toISOString() }
        : s
    ));
    return { success: true };
  };

  return (
    <AppContext.Provider
      value={{ 
        currentUser, 
        classes, 
        tasks, 
        resources, 
        messages,
        events,
        submissions,
        login, 
        logout, 
        addClass, 
        deleteClass,
        addTask,
        addResource,
        addMessage,
        addEvent,
        deleteEvent,
        addSubmission,
        gradeSubmission,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useAppContext() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useAppContext must be used within AppProvider');
  return ctx;
}

export default AppContext;
