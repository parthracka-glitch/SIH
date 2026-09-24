import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useAuthStore } from './lib/auth';
import { AppShell } from './components/layouts/AppShell';
import { LoginPage } from './pages/LoginPage';
import { DashboardPage } from './pages/DashboardPage';
import { PatientsPage } from './pages/PatientsPage';
import { ReferralsPage } from './pages/ReferralsPage';
import { MaternalNcdPage } from './pages/MaternalNcdPage';
import { TeleconsultPage } from './pages/TeleconsultPage';
import { AppointmentsPage } from './pages/AppointmentsPage';
import { PharmacyPage } from './pages/PharmacyPage';
import { LaboratoryPage } from './pages/LaboratoryPage';
import { EmergencyDispatchPage } from './pages/EmergencyDispatchPage';
import { ImmunizationPage } from './pages/ImmunizationPage';
import { AnalyticsPage } from './pages/AnalyticsPage';
import { HealthCardPage } from './pages/HealthCardPage';
import { AdminPage } from './pages/AdminPage';
import { PatientDashboard } from './pages/PatientDashboard';
import { AshaDashboard } from './pages/AshaDashboard';
import { DoctorDashboard } from './pages/DoctorDashboard';
import { FacilitiesPage } from './pages/FacilitiesPage';
import './styles/globals.css';
import './lib/i18n';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
});

const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return <AppShell>{children}</AppShell>;
};

export const App: React.FC = () => {
  const { initialize } = useAuthStore();

  useEffect(() => {
    initialize();
  }, [initialize]);

  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Routes>
          {/* Main ASHA Portal Views */}
          <Route path="/" element={<Navigate to="/asha" replace />} />
          <Route
            path="/asha"
            element={
              <ProtectedRoute>
                <AshaDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/patients"
            element={
              <ProtectedRoute>
                <PatientsPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/ncd-tracking"
            element={
              <ProtectedRoute>
                <MaternalNcdPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/emergency-dispatch"
            element={
              <ProtectedRoute>
                <EmergencyDispatchPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/immunization"
            element={
              <ProtectedRoute>
                <ImmunizationPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/health-card"
            element={
              <ProtectedRoute>
                <HealthCardPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/teleconsult"
            element={
              <ProtectedRoute>
                <TeleconsultPage />
              </ProtectedRoute>
            }
          />

          {/* Redirect all legacy, admin, doctor & other endpoints to /asha */}
          <Route path="/dashboard" element={<Navigate to="/asha" replace />} />
          <Route path="/admin" element={<Navigate to="/asha" replace />} />
          <Route path="/doctor" element={<Navigate to="/asha" replace />} />
          <Route path="/patient" element={<Navigate to="/asha" replace />} />
          <Route path="/analytics" element={<Navigate to="/asha" replace />} />
          <Route path="/facilities" element={<Navigate to="/asha" replace />} />
          <Route path="/pharmacy" element={<Navigate to="/asha" replace />} />
          <Route path="/referrals" element={<Navigate to="/asha" replace />} />
          <Route path="/lab" element={<Navigate to="/asha" replace />} />
          <Route path="/appointments" element={<Navigate to="/asha" replace />} />
          <Route path="/login" element={<Navigate to="/asha" replace />} />
          <Route path="/signup" element={<Navigate to="/asha" replace />} />

          {/* Catch-all redirect to /asha */}
          <Route path="*" element={<Navigate to="/asha" replace />} />
        </Routes>
      </BrowserRouter>
    </QueryClientProvider>
  );
};

export default App;
