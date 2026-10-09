import { useNavigate } from 'react-router-dom';
import { User, LogOut, CalendarCheck, Activity } from 'lucide-react';
import PatientLayout from '@/layouts/PatientLayout';
import Card from '@/components/Card';
import Button from '@/components/Button';
import Badge from '@/components/Badge';
import { getSession, logout } from '@/services/authService';
import { loadData } from '@/services/storageService';
import { priorityVariant } from '@/utils/helpers';

export default function PatientProfile() {
  const navigate = useNavigate();
  const session = getSession();
  const appointment = loadData('patientAppointment', null);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <PatientLayout>
      <div className="mx-auto max-w-2xl">
        <h1 className="mb-5 text-lg font-bold text-slate-800">My Profile</h1>

        <Card className="mb-5 p-6">
          <div className="flex items-center gap-4">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-teal-100 text-teal-600">
              <User size={28} />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-800">{session?.name || 'Patient'}</h2>
              <p className="text-sm text-slate-500">{session?.email || 'No email provided'}</p>
              <Badge variant="confirmed" className="mt-1">Patient</Badge>
            </div>
          </div>
          <div className="mt-4 border-t border-slate-200 pt-4">
            <div className="grid gap-3 sm:grid-cols-2">
              <div>
                <p className="text-xs font-medium text-slate-400">Role</p>
                <p className="text-sm text-slate-700">Patient</p>
              </div>
              <div>
                <p className="text-xs font-medium text-slate-400">Login Time</p>
                <p className="text-sm text-slate-700">
                  {session?.loginAt ? new Date(session.loginAt).toLocaleString() : '—'}
                </p>
              </div>
            </div>
          </div>
        </Card>

        {appointment ? (
          <Card className="mb-5 p-6">
            <h3 className="mb-4 flex items-center gap-2 text-sm font-bold text-slate-800">
              <CalendarCheck size={18} className="text-teal-600" />
              Current Appointment
            </h3>
            <div className="grid gap-3 sm:grid-cols-2">
              <InfoRow label="Patient" value={appointment.patient} />
              <InfoRow label="Department" value={appointment.department} />
              <InfoRow label="Doctor" value={appointment.doctor} />
              <InfoRow label="Room" value={appointment.room} />
              <InfoRow label="Floor" value={appointment.floor} />
              <InfoRow label="Time" value={appointment.time} />
              <InfoRow label="Priority" value={
                <Badge variant={priorityVariant(appointment.priority)}>{appointment.priority}</Badge>
              } />
              <InfoRow label="Status" value={
                <Badge variant="confirmed">{appointment.status}</Badge>
              } />
            </div>
            <div className="mt-4 flex gap-2">
              <Button size="sm" variant="secondary" onClick={() => navigate('/patient/find-room')}>
                Get Directions
              </Button>
              <Button size="sm" variant="secondary" onClick={() => navigate('/patient/appointment')}>
                View Appointment
              </Button>
            </div>
          </Card>
        ) : (
          <Card className="mb-5 p-6 text-center">
            <Activity className="mx-auto mb-2 text-slate-300" size={28} />
            <p className="text-sm text-slate-500">No appointment booked yet.</p>
            <Button size="sm" className="mt-3" onClick={() => navigate('/patient/appointment')}>
              Find My Appointment
            </Button>
          </Card>
        )}

        <div className="flex justify-end">
          <Button variant="danger" onClick={handleLogout}>
            <LogOut size={16} />
            Logout
          </Button>
        </div>

        <p className="mt-4 text-center text-xs text-slate-400">
          Demo Prototype — All data is synthetic.
        </p>
      </div>
    </PatientLayout>
  );
}

function InfoRow({ label, value }) {
  return (
    <div>
      <p className="text-xs font-medium text-slate-400">{label}</p>
      <div className="mt-0.5 text-sm font-semibold text-slate-700">{value}</div>
    </div>
  );
}
