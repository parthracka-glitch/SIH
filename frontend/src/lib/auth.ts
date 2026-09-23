import { create } from 'zustand';
import { api } from './api';

export interface UserProfile {
  id: string;
  username: string;
  full_name: string;
  role: 'SUPERADMIN' | 'DOCTOR' | 'CHO' | 'ANM' | 'ASHA' | 'PATIENT' | 'NURSE' | 'PHARMACIST' | 'BILLING';
  branch_id?: string;
  designation?: string;
  email?: string;
  phone?: string;
}

interface AuthState {
  user: UserProfile | null;
  accessToken: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (username: string, password: string) => Promise<UserProfile>;
  logout: () => void;
  initialize: () => Promise<void>;
}

// Fallback demo users in case backend is offline
const DEMO_USERS: Record<string, UserProfile> = {
  admin: {
    id: 'usr-admin-01',
    username: 'admin',
    full_name: 'Dr. Rajesh Kumar (Admin)',
    role: 'SUPERADMIN',
    designation: 'Chief Medical Officer / Admin',
  },
  'patient.ramesh': {
    id: 'usr-pat-01',
    username: 'patient.ramesh',
    full_name: 'Ramesh Yadav',
    role: 'PATIENT',
    designation: 'Citizen / ABHA Card Holder',
  },
  patient: {
    id: 'usr-pat-01',
    username: 'patient',
    full_name: 'Ramesh Yadav',
    role: 'PATIENT',
    designation: 'Citizen / ABHA Card Holder',
  },
  'dr.sharma': {
    id: 'usr-doc-01',
    username: 'dr.sharma',
    full_name: 'Dr. Priya Sharma',
    role: 'DOCTOR',
    designation: 'General Physician / Specialist',
  },
  doctor: {
    id: 'usr-doc-01',
    username: 'doctor',
    full_name: 'Dr. Priya Sharma',
    role: 'DOCTOR',
    designation: 'General Physician / Specialist',
  },
  'cho.meena': {
    id: 'usr-cho-01',
    username: 'cho.meena',
    full_name: 'Meena Kumari (CHO)',
    role: 'CHO',
    designation: 'Community Health Officer',
  },
  'anm.sunita': {
    id: 'usr-anm-01',
    username: 'anm.sunita',
    full_name: 'Sunita Devi (ANM)',
    role: 'ANM',
    designation: 'Auxiliary Nurse Midwife',
  },
  'asha.rekha': {
    id: 'usr-asha-01',
    username: 'asha.rekha',
    full_name: 'Rekha Bai (ASHA)',
    role: 'ASHA',
    designation: 'Village Health Worker',
  },
  asha: {
    id: 'usr-asha-01',
    username: 'asha',
    full_name: 'Rekha Bai (ASHA)',
    role: 'ASHA',
    designation: 'Village Health Worker',
  },
};

export const useAuthStore = create<AuthState>((set) => ({
  user: JSON.parse(localStorage.getItem('arogya_user') || 'null'),
  accessToken: localStorage.getItem('arogya_access_token'),
  isAuthenticated: !!localStorage.getItem('arogya_access_token'),
  isLoading: false,

  login: async (username: string, password: string) => {
    set({ isLoading: true });
    try {
      const data = await api.post('/auth/login', { username, password });
      localStorage.setItem('arogya_access_token', data.access_token);
      localStorage.setItem('arogya_refresh_token', data.refresh_token);
      localStorage.setItem('arogya_user', JSON.stringify(data.user));

      set({
        user: data.user,
        accessToken: data.access_token,
        isAuthenticated: true,
        isLoading: false,
      });
      return data.user as UserProfile;
    } catch (err) {
      // Demo offline fallback
      const normalizedUser = username.toLowerCase().trim();
      const mockUser = DEMO_USERS[normalizedUser];
      if (mockUser) {
        const mockToken = `mock-token-${mockUser.role.toLowerCase()}-${Date.now()}`;
        localStorage.setItem('arogya_access_token', mockToken);
        localStorage.setItem('arogya_user', JSON.stringify(mockUser));

        set({
          user: mockUser,
          accessToken: mockToken,
          isAuthenticated: true,
          isLoading: false,
        });
        return mockUser;
      }

      set({ isLoading: false });
      throw err;
    }
  },

  logout: () => {
    localStorage.removeItem('arogya_access_token');
    localStorage.removeItem('arogya_refresh_token');
    localStorage.removeItem('arogya_user');
    set({
      user: null,
      accessToken: null,
      isAuthenticated: false,
      isLoading: false,
    });
  },

  initialize: async () => {
    const token = localStorage.getItem('arogya_access_token');
    if (!token) return;

    try {
      const user = await api.get<UserProfile>('/auth/me');
      localStorage.setItem('arogya_user', JSON.stringify(user));
      set({ user, isAuthenticated: true });
    } catch {
      // Token might be invalid or expired
      localStorage.removeItem('arogya_access_token');
      localStorage.removeItem('arogya_user');
      set({ user: null, isAuthenticated: false });
    }
  },
}));
