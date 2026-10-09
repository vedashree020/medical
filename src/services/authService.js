// ============================================================
// QMedSync — Auth Service (Frontend Demo Only)
// Authentication is simulated using localStorage.
// No real backend authentication is used.
// ============================================================

import { loadData, saveData, removeData } from './storageService';

const ADMIN_CREDENTIALS = {
  email: 'admin@qmedsync.demo',
  password: 'demo123',
};

export function login(role, credentials) {
  if (role === 'staff') {
    if (
      credentials.email === ADMIN_CREDENTIALS.email &&
      credentials.password === ADMIN_CREDENTIALS.password
    ) {
      const session = {
        role: 'staff',
        name: 'Admin',
        email: credentials.email,
        loginAt: new Date().toISOString(),
      };
      saveData('session', session);
      return { success: true, session };
    }
    return { success: false, error: 'Invalid staff credentials.' };
  }

  // Patient role — accept any demo details
  const session = {
    role: 'patient',
    name: credentials.name || 'Guest Patient',
    email: credentials.email || '',
    age: credentials.age || '',
    gender: credentials.gender || '',
    loginAt: new Date().toISOString(),
  };
  saveData('session', session);
  return { success: true, session };
}

export function getSession() {
  return loadData('session', null);
}

export function logout() {
  removeData('session');
}

export function isLoggedIn() {
  const session = getSession();
  return session !== null;
}
