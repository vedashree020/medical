import { useMemo } from 'react';
import {
  BarChart3,
  Users,
  Stethoscope,
  DoorOpen,
  TrendingUp,
} from 'lucide-react';
import StaffLayout from '@/layouts/StaffLayout';
import PageHeader from '@/components/PageHeader';
import Card from '@/components/Card';
import StatCard from '@/components/StatCard';
import {
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  RadialBarChart,
  RadialBar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { SCHEDULE, DOCTORS, ROOMS, INITIAL_PATIENTS } from '@/data/hospitalData';
import { loadData, saveData } from '@/services/storageService';

const COLORS = ['#0d9488', '#0ea5e9', '#f59e0b', '#ef4444', '#8b5cf6'];

export default function StaffAnalytics() {
  const patients = loadData('patients', INITIAL_PATIENTS);
  saveData('patients', patients);

  const priorityData = useMemo(() => {
    const emergency = patients.filter((p) => p.priority === 'Emergency').length;
    const urgent = patients.filter((p) => p.priority === 'Urgent').length;
    const routine = patients.filter((p) => p.priority === 'Routine').length;
    return [
      { name: 'Emergency', value: emergency, fill: '#ef4444' },
      { name: 'Urgent', value: urgent, fill: '#f59e0b' },
      { name: 'Routine', value: routine, fill: '#0ea5e9' },
    ];
  }, [patients]);

  const doctorUtilization = useMemo(() => {
    return DOCTORS.map((doc) => {
      const count = patients.filter((p) => p.doctor === doc.name).length;
      const maxSlots = doc.slots.length;
      const utilization = Math.round((count / maxSlots) * 100);
      return {
        name: doc.name,
        patients: count,
        utilization,
        fill: '#0d9488',
      };
    });
  }, [patients]);

  const roomUtilization = useMemo(() => {
    return ROOMS.map((room) => {
      const count = patients.filter((p) => p.room === room.name).length;
      const utilization = Math.min(100, count * 35);
      return {
        name: room.name,
        patients: count,
        utilization,
        fill: '#0ea5e9',
      };
    });
  }, [patients]);

  const departmentData = useMemo(() => {
    const depts = ['Cardiology', 'Neurology', 'Orthopedics'];
    return depts.map((dept) => ({
      name: dept,
      patients: patients.filter((p) => p.department === dept).length,
    }));
  }, [patients]);

  return (
    <StaffLayout>
      <PageHeader
        title="Analytics"
        subtitle="Hospital scheduling metrics — synthetic prototype data"
        icon={BarChart3}
      />

      <div className="mb-6 rounded-lg border border-slate-200 bg-slate-50 px-4 py-2.5">
        <p className="text-xs text-slate-500">
          All displayed values are prototype / synthetic data. No real-world statistics are represented.
        </p>
      </div>

      {/* Stats */}
      <div className="mb-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard icon={Users} label="Patients Scheduled" value={patients.length} color="teal" />
        <StatCard icon={TrendingUp} label="Emergency Cases" value={priorityData[0].value} color="red" />
        <StatCard icon={TrendingUp} label="Urgent Cases" value={priorityData[1].value} color="amber" />
        <StatCard icon={TrendingUp} label="Routine Cases" value={priorityData[2].value} color="sky" />
      </div>

      <div className="grid gap-5 lg:grid-cols-2">
        {/* Priority distribution */}
        <Card className="p-5">
          <h2 className="mb-4 text-sm font-bold text-slate-800">Priority Distribution</h2>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie
                data={priorityData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={90}
                paddingAngle={3}
                dataKey="value"
              >
                {priorityData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.fill} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </Card>

        {/* Department distribution */}
        <Card className="p-5">
          <h2 className="mb-4 text-sm font-bold text-slate-800">Patients by Department</h2>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={departmentData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="name" tick={{ fontSize: 12 }} stroke="#64748b" />
              <YAxis tick={{ fontSize: 12 }} stroke="#64748b" allowDecimals={false} />
              <Tooltip />
              <Bar dataKey="patients" fill="#0d9488" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </Card>

        {/* Doctor utilization */}
        <Card className="p-5">
          <h2 className="mb-4 flex items-center gap-2 text-sm font-bold text-slate-800">
            <Stethoscope size={16} className="text-teal-600" />
            Doctor Utilization
          </h2>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={doctorUtilization} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" horizontal={false} />
              <XAxis type="number" tick={{ fontSize: 12 }} stroke="#64748b" domain={[0, 100]} />
              <YAxis type="category" dataKey="name" tick={{ fontSize: 12 }} stroke="#64748b" width={80} />
              <Tooltip formatter={(value) => [`${value}%`, 'Utilization']} />
              <Bar dataKey="utilization" fill="#0d9488" radius={[0, 4, 4, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </Card>

        {/* Room utilization */}
        <Card className="p-5">
          <h2 className="mb-4 flex items-center gap-2 text-sm font-bold text-slate-800">
            <DoorOpen size={16} className="text-teal-600" />
            Room Utilization
          </h2>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={roomUtilization} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" horizontal={false} />
              <XAxis type="number" tick={{ fontSize: 12 }} stroke="#64748b" domain={[0, 100]} />
              <YAxis type="category" dataKey="name" tick={{ fontSize: 12 }} stroke="#64748b" width={100} />
              <Tooltip formatter={(value) => [`${value}%`, 'Utilization']} />
              <Bar dataKey="utilization" fill="#0ea5e9" radius={[0, 4, 4, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </Card>
      </div>
    </StaffLayout>
  );
}
