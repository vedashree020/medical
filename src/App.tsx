import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

import Login from '@/pages/Login';
import ProtectedRoute from '@/components/ProtectedRoute';

// Patient pages
import PatientHome from '@/pages/patient/PatientHome';
import FindAppointment from '@/pages/patient/FindAppointment';
import FindRoom from '@/pages/patient/FindRoom';
import VoiceAssistant from '@/pages/patient/VoiceAssistant';
import PatientProfile from '@/pages/patient/PatientProfile';

// Staff pages
import StaffDashboard from '@/pages/staff/StaffDashboard';
import StaffPatients from '@/pages/staff/StaffPatients';
import StaffDoctors from '@/pages/staff/StaffDoctors';
import StaffRooms from '@/pages/staff/StaffRooms';
import StaffAppointments from '@/pages/staff/StaffAppointments';
import StaffOptimization from '@/pages/staff/StaffOptimization';
import StaffEmergency from '@/pages/staff/StaffEmergency';
import StaffAnalytics from '@/pages/staff/StaffAnalytics';
import StaffSettings from '@/pages/staff/StaffSettings';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public */}
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/login" element={<Login />} />

        {/* Patient routes */}
        <Route
          path="/patient/home"
          element={
            <ProtectedRoute role="patient">
              <PatientHome />
            </ProtectedRoute>
          }
        />
        <Route
          path="/patient/appointment"
          element={
            <ProtectedRoute role="patient">
              <FindAppointment />
            </ProtectedRoute>
          }
        />
        <Route
          path="/patient/find-room"
          element={
            <ProtectedRoute role="patient">
              <FindRoom />
            </ProtectedRoute>
          }
        />
        <Route
          path="/patient/voice"
          element={
            <ProtectedRoute role="patient">
              <VoiceAssistant />
            </ProtectedRoute>
          }
        />
        <Route
          path="/patient/profile"
          element={
            <ProtectedRoute role="patient">
              <PatientProfile />
            </ProtectedRoute>
          }
        />

        {/* Staff routes */}
        <Route
          path="/staff/dashboard"
          element={
            <ProtectedRoute role="staff">
              <StaffDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/staff/patients"
          element={
            <ProtectedRoute role="staff">
              <StaffPatients />
            </ProtectedRoute>
          }
        />
        <Route
          path="/staff/doctors"
          element={
            <ProtectedRoute role="staff">
              <StaffDoctors />
            </ProtectedRoute>
          }
        />
        <Route
          path="/staff/rooms"
          element={
            <ProtectedRoute role="staff">
              <StaffRooms />
            </ProtectedRoute>
          }
        />
        <Route
          path="/staff/appointments"
          element={
            <ProtectedRoute role="staff">
              <StaffAppointments />
            </ProtectedRoute>
          }
        />
        <Route
          path="/staff/optimization"
          element={
            <ProtectedRoute role="staff">
              <StaffOptimization />
            </ProtectedRoute>
          }
        />
        <Route
          path="/staff/emergency"
          element={
            <ProtectedRoute role="staff">
              <StaffEmergency />
            </ProtectedRoute>
          }
        />
        <Route
          path="/staff/analytics"
          element={
            <ProtectedRoute role="staff">
              <StaffAnalytics />
            </ProtectedRoute>
          }
        />
        <Route
          path="/staff/settings"
          element={
            <ProtectedRoute role="staff">
              <StaffSettings />
            </ProtectedRoute>
          }
        />

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
