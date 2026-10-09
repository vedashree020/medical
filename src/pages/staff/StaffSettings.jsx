import { useNavigate } from 'react-router-dom';
import { Settings, LogOut, Activity, Database, Info, Shield } from 'lucide-react';
import StaffLayout from '@/layouts/StaffLayout';
import PageHeader from '@/components/PageHeader';
import Card from '@/components/Card';
import Button from '@/components/Button';
import { getSession, logout } from '@/services/authService';

export default function StaffSettings() {
  const navigate = useNavigate();
  const session = getSession();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const handleResetData = () => {
    const keys = ['patients', 'patientAppointment'];
    keys.forEach((k) => {
      try {
        localStorage.removeItem('qmedsync_' + k);
      } catch {
        // ignore
      }
    });
    window.location.reload();
  };

  return (
    <StaffLayout>
      <PageHeader
        title="Settings"
        subtitle="Application and account settings"
        icon={Settings}
      />

      <div className="grid gap-5 lg:grid-cols-2">
        {/* Account */}
        <Card className="p-5">
          <h2 className="mb-4 flex items-center gap-2 text-sm font-bold text-slate-800">
            <Shield size={16} className="text-teal-600" />
            Account
          </h2>
          <div className="space-y-3">
            <div>
              <p className="text-xs text-slate-400">Name</p>
              <p className="text-sm font-medium text-slate-700">{session?.name || 'Admin'}</p>
            </div>
            <div>
              <p className="text-xs text-slate-400">Email</p>
              <p className="text-sm font-medium text-slate-700">{session?.email || 'admin@qmedsync.demo'}</p>
            </div>
            <div>
              <p className="text-xs text-slate-400">Role</p>
              <p className="text-sm font-medium text-slate-700">Staff / Admin</p>
            </div>
            <div>
              <p className="text-xs text-slate-400">Login Time</p>
              <p className="text-sm font-medium text-slate-700">
                {session?.loginAt ? new Date(session.loginAt).toLocaleString() : '—'}
              </p>
            </div>
          </div>
          <div className="mt-4 border-t border-slate-200 pt-4">
            <Button variant="danger" onClick={handleLogout}>
              <LogOut size={16} />
              Logout
            </Button>
          </div>
        </Card>

        {/* Data management */}
        <Card className="p-5">
          <h2 className="mb-4 flex items-center gap-2 text-sm font-bold text-slate-800">
            <Database size={16} className="text-teal-600" />
            Data Management
          </h2>
          <p className="mb-3 text-xs text-slate-500">
            The application uses localStorage for demo data. Resetting will restore the original
            synthetic patient data.
          </p>
          <Button variant="secondary" onClick={handleResetData}>
            Reset Demo Data
          </Button>
        </Card>

        {/* About */}
        <Card className="p-5 lg:col-span-2">
          <h2 className="mb-4 flex items-center gap-2 text-sm font-bold text-slate-800">
            <Info size={16} className="text-teal-600" />
            About QMedSync
          </h2>
          <div className="space-y-2 text-sm text-slate-600">
            <p>
              <strong>QMedSync</strong> is a smart patient-to-doctor and room assignment system for
              hospitals. It identifies the appropriate department based on the patient's problem,
              then assigns a suitable doctor, room, and time slot.
            </p>
            <p>
              The optimization service is simulated in the frontend and is designed for future
              integration with the QMedSync Python optimization backend (classical simulated
              annealing + QAOA quantum proof-of-concept).
            </p>
            <div className="mt-3 flex items-center gap-2 rounded-lg bg-slate-50 px-4 py-2.5">
              <Activity size={16} className="text-teal-600" />
              <span className="text-xs text-slate-500">
                Version: Frontend Prototype — All data is synthetic.
              </span>
            </div>
          </div>
        </Card>
      </div>
    </StaffLayout>
  );
}
