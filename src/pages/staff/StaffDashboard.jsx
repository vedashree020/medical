import { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Users,
  Stethoscope,
  DoorOpen,
  AlertTriangle,
  CalendarDays,
  Activity,
  ArrowRight,
  Clock,
} from 'lucide-react';
import StaffLayout from '@/layouts/StaffLayout';
import StatCard from '@/components/StatCard';
import Card from '@/components/Card';
import Badge from '@/components/Badge';
import PageHeader from '@/components/PageHeader';
import { loadData, saveData } from '@/services/storageService';
import { INITIAL_PATIENTS, DOCTORS, ROOMS, SCHEDULE } from '@/data/hospitalData';
import { priorityVariant, statusVariant } from '@/utils/helpers';

export default function StaffDashboard() {
  const navigate = useNavigate();
  const patients = loadData('patients', INITIAL_PATIENTS);
  saveData('patients', patients);

  const stats = useMemo(() => {
    const emergencyCount = patients.filter((p) => p.priority === 'Emergency').length;
    const todayAppts = SCHEDULE.length;
    return {
      totalPatients: patients.length,
      availableDoctors: DOCTORS.filter((d) => d.status === 'Available').length,
      availableRooms: ROOMS.filter((r) => r.available).length,
      emergencyPatients: emergencyCount,
      todayAppointments: todayAppts,
    };
  }, [patients]);

  return (
    <StaffLayout>
      <PageHeader
        title="Dashboard"
        subtitle="Hospital overview — October 8, 2026"
        icon={Activity}
      />

      {/* Stats grid */}
      <div className="mb-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
        <StatCard icon={Users} label="Total Patients" value={stats.totalPatients} color="teal" />
        <StatCard icon={Stethoscope} label="Available Doctors" value={stats.availableDoctors} color="sky" />
        <StatCard icon={DoorOpen} label="Available Rooms" value={stats.availableRooms} color="green" />
        <StatCard icon={AlertTriangle} label="Emergency Cases" value={stats.emergencyPatients} color="red" />
        <StatCard icon={CalendarDays} label="Today's Appointments" value={stats.todayAppointments} color="amber" />
      </div>

      <div className="grid gap-5 lg:grid-cols-2">
        {/* Today's schedule */}
        <Card className="p-5">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="flex items-center gap-2 text-sm font-bold text-slate-800">
              <Clock size={16} className="text-teal-600" />
              Today's Schedule
            </h2>
            <button
              onClick={() => navigate('/staff/appointments')}
              className="text-xs font-medium text-teal-600 hover:text-teal-700"
            >
              View all →
            </button>
          </div>
          <div className="space-y-2">
            {SCHEDULE.slice(0, 5).map((item, i) => (
              <div
                key={i}
                className="flex items-center gap-3 rounded-lg border border-slate-100 p-3 transition-colors hover:bg-slate-50"
              >
                <div className="w-20 shrink-0 text-xs font-semibold text-slate-500">
                  {item.time}
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-slate-700">{item.patient}</p>
                  <p className="text-xs text-slate-400">{item.doctor} — {item.room}</p>
                </div>
                <Badge variant={priorityVariant(item.priority)}>{item.priority}</Badge>
              </div>
            ))}
          </div>
        </Card>

        {/* Quick actions */}
        <Card className="p-5">
          <h2 className="mb-4 text-sm font-bold text-slate-800">Quick Actions</h2>
          <div className="grid gap-3 sm:grid-cols-2">
            <QuickAction
              icon={Users}
              label="Manage Patients"
              desc="View, add, edit patients"
              onClick={() => navigate('/staff/patients')}
            />
            <QuickAction
              icon={Stethoscope}
              label="View Doctors"
              desc="Doctor availability & schedules"
              onClick={() => navigate('/staff/doctors')}
            />
            <QuickAction
              icon={Activity}
              label="Optimization"
              desc="Run scheduling optimization"
              onClick={() => navigate('/staff/optimization')}
            />
            <QuickAction
              icon={AlertTriangle}
              label="Emergency"
              desc="Add emergency patient"
              onClick={() => navigate('/staff/emergency')}
            />
          </div>
        </Card>
      </div>

      {/* Recent patients */}
      <Card className="mt-5 p-5">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-sm font-bold text-slate-800">Recent Patients</h2>
          <button
            onClick={() => navigate('/staff/patients')}
            className="text-xs font-medium text-teal-600 hover:text-teal-700"
          >
            View all →
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-200 text-left text-xs text-slate-400">
                <th className="pb-2 pr-4 font-medium">Name</th>
                <th className="pb-2 pr-4 font-medium">Department</th>
                <th className="pb-2 pr-4 font-medium">Doctor</th>
                <th className="pb-2 pr-4 font-medium">Time</th>
                <th className="pb-2 font-medium">Priority</th>
              </tr>
            </thead>
            <tbody>
              {patients.slice(0, 6).map((p) => (
                <tr key={p.id} className="border-b border-slate-100 last:border-0">
                  <td className="py-2.5 pr-4 font-medium text-slate-700">{p.name}</td>
                  <td className="py-2.5 pr-4 text-slate-500">{p.department}</td>
                  <td className="py-2.5 pr-4 text-slate-500">{p.doctor}</td>
                  <td className="py-2.5 pr-4 text-slate-500">{p.time}</td>
                  <td className="py-2.5"><Badge variant={priorityVariant(p.priority)}>{p.priority}</Badge></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </StaffLayout>
  );
}

function QuickAction({ icon: Icon, label, desc, onClick }) {
  return (
    <button
      onClick={onClick}
      className="group flex flex-col gap-1 rounded-lg border border-slate-200 p-4 text-left transition-all hover:border-teal-200 hover:shadow-sm"
    >
      <div className="flex items-center justify-between">
        <Icon className="text-teal-600" size={20} />
        <ArrowRight className="text-slate-300 transition-colors group-hover:text-teal-500" size={16} />
      </div>
      <p className="mt-1 text-sm font-semibold text-slate-700">{label}</p>
      <p className="text-xs text-slate-400">{desc}</p>
    </button>
  );
}
