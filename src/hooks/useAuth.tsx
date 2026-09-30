import React, { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import { onAuthStateChanged, signInWithEmailAndPassword, signOut, type User } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { auth, db } from '../lib/firebase';

export type AdminRole = 'superadmin' | 'writer' | null;

interface AuthContextType {
  currentUser: User | null;
  role: AdminRole;
  loading: boolean;
  login: (email: string, pass: string) => Promise<void>;
  logout: () => Promise<void>;
}

const ADMIN_EMAIL = (import.meta.env.VITE_ADMIN_EMAIL || 'kabarterbaru.id@gmail.com').toLowerCase();

const AuthContext = createContext<AuthContextType>({
  currentUser: null,
  role: null,
  loading: true,
  login: async () => {},
  logout: async () => {},
});

async function resolveRole(user: User): Promise<AdminRole> {
  if (user.email?.toLowerCase() === ADMIN_EMAIL) return 'superadmin';
  try {
    const snap = await getDoc(doc(db, 'authors', user.uid));
    const role = snap.exists() ? snap.data()?.role : null;
    return role === 'superadmin' || role === 'writer' ? role : null;
  } catch (error) {
    console.error('Gagal memverifikasi role admin:', error);
    return null;
  }
}

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [role, setRole] = useState<AdminRole>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setLoading(true);
      setCurrentUser(user);
      if (user) {
        setRole(await resolveRole(user));
      } else {
        setRole(null);
      }
      setLoading(false);
    });
    return unsubscribe;
  }, []);

  const login = async (email: string, pass: string) => {
    await signInWithEmailAndPassword(auth, email.trim(), pass);
  };

  const logout = async () => {
    await signOut(auth);
  };

  return (
    <AuthContext.Provider value={{ currentUser, role, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
