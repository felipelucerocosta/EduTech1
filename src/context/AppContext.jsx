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
  localStorage.setItem(key, JSON.stringify(data));
};

// ─── Context ─────────────────────────────────────────
const AppContext = createContext(null);

export function AppProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [classes, setClasses] = useState(() => loadFromStorage(KEYS.CLASSES));
  const [tasks, setTasks] = useState(() => loadFromStorage(KEYS.TASKS));
  const [resources, setResources] = useState(() => loadFromStorage(KEYS.RESOURCES));
  const [messages, setMessages] = useState(() => loadFromStorage(KEYS.MESSAGES));

  // Persist all state whenever it changes
  useEffect(() => { saveToStorage(KEYS.CLASSES, classes); }, [classes]);
  useEffect(() => { saveToStorage(KEYS.TASKS, tasks); }, [tasks]);
  useEffect(() => { saveToStorage(KEYS.RESOURCES, resources); }, [resources]);
  useEffect(() => { saveToStorage(KEYS.MESSAGES, messages); }, [messages]);

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

  return (
    <AppContext.Provider
      value={{ 
        currentUser, 
        classes, 
        tasks, 
        resources, 
        messages,
        login, 
        logout, 
        addClass, 
        deleteClass,
        addTask,
        addResource,
        addMessage,
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
