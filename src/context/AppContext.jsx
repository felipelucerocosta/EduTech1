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

// ─── localStorage helpers ────────────────────────────
const CLASSES_KEY = 'edutech_classes';

const loadClasses = () => {
  try {
    const raw = localStorage.getItem(CLASSES_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
};

const saveClasses = (classes) => {
  localStorage.setItem(CLASSES_KEY, JSON.stringify(classes));
};

// ─── Context ─────────────────────────────────────────
const AppContext = createContext(null);

export function AppProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [classes, setClasses] = useState(loadClasses);

  // Persist classes whenever they change
  useEffect(() => {
    saveClasses(classes);
  }, [classes]);

  /**
   * Authenticate against hardcoded test accounts.
   * Returns { success, user?, error? }
   */
  const login = (email, password) => {
    const account = TEST_ACCOUNTS.find(
      (a) => a.email.toLowerCase() === email.toLowerCase() && a.password === password
    );
    if (!account) {
      return { success: false, error: 'Credenciales incorrectas. Verificá tu correo y contraseña.' };
    }
    const user = { email: account.email, role: account.role, name: account.name };
    setCurrentUser(user);
    return { success: true, user };
  };

  const logout = () => {
    setCurrentUser(null);
  };

  /**
   * Create a new class.
   * Uniqueness key: materia + curso + division + turno (case-insensitive).
   * Returns { success, error? }
   */
  const addClass = ({ materia, curso, division, turno }) => {
    const key = `${materia}|${curso}|${division}|${turno}`.toLowerCase();
    const exists = classes.some(
      (c) => `${c.materia}|${c.curso}|${c.division}|${c.turno}`.toLowerCase() === key
    );
    if (exists) {
      return { success: false, error: 'Ya existe una clase con esa materia, curso, división y turno.' };
    }
    const newClass = {
      id: Date.now().toString(36) + Math.random().toString(36).slice(2, 6),
      materia,
      curso,
      division,
      turno,
      profesor: currentUser?.name || 'Desconocido',
      profesorEmail: currentUser?.email || '',
      createdAt: new Date().toISOString(),
      alumnos: [],
    };
    setClasses((prev) => [...prev, newClass]);
    return { success: true };
  };

  /**
   * Delete a class by id (only professor who created it).
   */
  const deleteClass = (classId) => {
    setClasses((prev) => prev.filter((c) => c.id !== classId));
  };

  return (
    <AppContext.Provider
      value={{ currentUser, classes, login, logout, addClass, deleteClass }}
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
