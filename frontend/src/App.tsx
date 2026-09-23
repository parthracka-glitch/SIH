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

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles?: string[];
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, allowedRoles }) => {
  const { isAuthenticated, user } = useAuthStore();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // If user is a Patient and attempts to access clinical/staff/admin routes
  if (user?.role === 'PATIENT' && allowedRoles && !allowedRoles.includes('PATIENT')) {
    return <Navigate to="/patient" replace />;
  }

  // If specific roles are required and user role doesn't match
  if (allowedRoles && user && !allowedRoles.includes(user.role) && user.role !== 'SUPERADMIN') {
    if (user.role === 'PATIENT') return <Navigate to="/patient" replace />;
    if (user.role === 'DOCTOR') return <Navigate to="/doctor" replace />;
    if (user.role === 'ASHA' || user.role === 'CHO' || user.role === 'ANM') return <Navigate to="/asha" replace />;
    return <Navigate to="/dashboard" replace />;
  }

  return <AppShell>{children}</AppShell>;
};

const RootRedirect: React.FC = () => {
  const { isAuthenticated, user } = useAuthStore();
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  if (user?.role === 'PATIENT') return <Navigate to="/patient" replace />;
  if (user?.role === 'DOCTOR') return <Navigate to="/doctor" replace />;
  if (user?.role === 'ASHA' || user?.role === 'CHO' || user?.role === 'ANM') return <Navigate to="/asha" replace />;
  return <Navigate to="/dashboard" replace />;
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
          <Route path="/login" element={<LoginPage />} />

          {/* Dedicated Role Dashboards */}
          <Route
            path="/patient"
            element={
              <ProtectedRoute allowedRoles={['PATIENT', 'SUPERADMIN']}>
                <PatientDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/doctor"
            element={
              <ProtectedRoute allowedRoles={['DOCTOR', 'SUPERADMIN']}>
                <DoctorDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/asha"
            element={
              <ProtectedRoute allowedRoles={['ASHA', 'CHO', 'ANM', 'SUPERADMIN']}>
                <AshaDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute allowedRoles={['SUPERADMIN', 'DOCTOR', 'CHO', 'ANM', 'ASHA', 'NURSE', 'PHARMACIST', 'BILLING']}>
                <DashboardPage />
              </ProtectedRoute>
            }
          />

          {/* Shared / Citizen Accessible Healthcare Features */}
          <Route
            path="/health-card"
            element={
              <ProtectedRoute allowedRoles={['PATIENT', 'SUPERADMIN', 'DOCTOR', 'ASHA', 'CHO', 'ANM']}>
                <HealthCardPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/appointments"
            element={
              <ProtectedRoute allowedRoles={['PATIENT', 'SUPERADMIN', 'DOCTOR', 'ASHA', 'CHO', 'ANM']}>
                <AppointmentsPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/teleconsult"
            element={
              <ProtectedRoute allowedRoles={['PATIENT', 'SUPERADMIN', 'DOCTOR', 'ASHA', 'CHO', 'ANM']}>
                <TeleconsultPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/pharmacy"
            element={
              <ProtectedRoute allowedRoles={['PATIENT', 'SUPERADMIN', 'DOCTOR', 'PHARMACIST', 'ASHA', 'CHO', 'ANM']}>
                <PharmacyPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/facilities"
            element={
              <ProtectedRoute allowedRoles={['PATIENT', 'SUPERADMIN', 'DOCTOR', 'ASHA', 'CHO', 'ANM']}>
                <FacilitiesPage />
              </ProtectedRoute>
            }
          />

          {/* Clinical / Staff / Hospital Hub Exclusive Features */}
          <Route
            path="/patients"
            element={
              <ProtectedRoute allowedRoles={['SUPERADMIN', 'DOCTOR', 'CHO', 'ANM', 'ASHA', 'NURSE']}>
                <PatientsPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/referrals"
            element={
              <ProtectedRoute allowedRoles={['SUPERADMIN', 'DOCTOR', 'CHO', 'ANM', 'ASHA']}>
                <ReferralsPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/ncd-tracking"
            element={
              <ProtectedRoute allowedRoles={['SUPERADMIN', 'DOCTOR', 'CHO', 'ANM', 'ASHA']}>
                <MaternalNcdPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/lab"
            element={
              <ProtectedRoute allowedRoles={['SUPERADMIN', 'DOCTOR', 'LAB_TECH', 'NURSE']}>
                <LaboratoryPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/emergency-dispatch"
            element={
              <ProtectedRoute allowedRoles={['SUPERADMIN', 'DOCTOR', 'CHO', 'ANM', 'ASHA', 'NURSE']}>
                <EmergencyDispatchPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/immunization"
            element={
              <ProtectedRoute allowedRoles={['SUPERADMIN', 'DOCTOR', 'CHO', 'ANM', 'ASHA', 'NURSE']}>
                <ImmunizationPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/analytics"
            element={
              <ProtectedRoute allowedRoles={['SUPERADMIN', 'DOCTOR']}>
                <AnalyticsPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin"
            element={
              <ProtectedRoute allowedRoles={['SUPERADMIN']}>
                <AdminPage />
              </ProtectedRoute>
            }
          />

          {/* Root & Catch-all dedicated redirect */}
          <Route path="/" element={<RootRedirect />} />
          <Route path="*" element={<RootRedirect />} />
        </Routes>
      </BrowserRouter>
    </QueryClientProvider>
  );
};

export default App;
