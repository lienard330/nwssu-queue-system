import { createContext, useContext, useState, useEffect } from 'react';
import { mockStudents } from '../data/mockStudents';
import { mockStaff } from '../data/mockStaff';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [auth, setAuth] = useState(() => {
    try {
      const stored = localStorage.getItem('nwssu_auth');
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  });

  useEffect(() => {
    if (auth) {
      localStorage.setItem('nwssu_auth', JSON.stringify(auth));
    } else {
      localStorage.removeItem('nwssu_auth');
    }
  }, [auth]);

  const loginStudent = (studentId) => {
    const student = mockStudents.find((s) => s.id === studentId);
    if (!student) return { success: false, error: 'Student ID not found. Please try again.' };
    if (!studentId.trim()) return { success: false, error: 'Please enter your Student ID' };
    setAuth({ type: 'student', user: student, role: null });
    return { success: true };
  };

  const loginStaff = (username, password) => {
    const staff = mockStaff.find((s) => s.username === username && s.password === password);
    if (!staff) return { success: false, error: 'Invalid username or password.' };
    setAuth({ type: 'staff', user: staff, role: staff.role });
    return { success: true, role: staff.role };
  };

  const setRole = (role) => {
    if (!auth) return;
    setAuth({ ...auth, role });
  };

  const logout = () => {
    setAuth(null);
  };

  const isStudent = auth?.type === 'student';
  const isStaff = auth?.type === 'staff';
  const isAdmin = auth?.role === 'Administrator';
  const isRegistrarStaff = auth?.role === 'Registrar Staff';
  const isOperator = auth?.role === 'Window Operator';

  return (
    <AuthContext.Provider value={{ auth, loginStudent, loginStaff, setRole, logout, isStudent, isStaff, isAdmin, isRegistrarStaff, isOperator }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
