import { Navigate } from 'react-router-dom';
import { getSession } from '@/services/authService';

export default function ProtectedRoute({ role, children }) {
  const session = getSession();

  if (!session) {
    return <Navigate to="/login" replace />;
  }

  if (role && session.role !== role) {
    return <Navigate to={session.role === 'staff' ? '/staff/dashboard' : '/patient/home'} replace />;
  }

  return children;
}
