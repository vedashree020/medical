import { CalendarDays, Clock, Stethoscope, DoorOpen } from 'lucide-react';
import StaffLayout from '@/layouts/StaffLayout';
import PageHeader from '@/components/PageHeader';
import Card from '@/components/Card';
import Badge from '@/components/Badge';
import StatCard from '@/components/StatCard';
import { SCHEDULE } from '@/data/hospitalData';
import { priorityVariant } from '@/utils/helpers';

export default function StaffAppointments() {

  return (
    <StaffLayout>
      <PageHeader
        title="Appointments"
        subtitle="Today's appointment schedule — October 8, 2026"
        icon={CalendarDays}
      />

      <div className="mb-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard icon={CalendarDays} label="Total Appointments" value={SCHEDULE.length} color="teal" />
        <StatCard icon={Clock} label="Emergency" value={SCHEDULE.filter((s) => s.priority === 'Emergency').length} color="red" />
        <StatCard icon={Clock} label="Urgent" value={SCHEDULE.filter((s) => s.priority === 'Urgent').length} color="amber" />
        <StatCard icon={Clock} label="Routine" value={SCHEDULE.filter((s) => s.priority === 'Routine').length} color="sky" />
      </div>

      {/* Timeline view */}
      <Card className="mb-5 p-5">
        <h2 className="mb-4 text-sm font-bold text-slate-800">Schedule Timeline</h2>
        <div className="space-y-3">
          {SCHEDULE.map((apt, i) => (
            <div
              key={i}
              className="flex items-center gap-4 rounded-lg border border-slate-100 p-3 transition-colors hover:bg-slate-50"
            >
              <div className="w-28 shrink-0">
                <p className="text-sm font-bold text-teal-700">{apt.time}</p>
              </div>
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-slate-100">
                <CalendarDays size={18} className="text-slate-500" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-semibold text-slate-700">{apt.patient}</p>
                <div className="mt-0.5 flex flex-wrap items-center gap-x-3 gap-y-0.5 text-xs text-slate-400">
                  <span className="flex items-center gap-1">
                    <Stethoscope size={12} />
                    {apt.doctor}
                  </span>
                  <span className="flex items-center gap-1">
                    <DoorOpen size={12} />
                    {apt.room}
                  </span>
                </div>
              </div>
              <Badge variant={priorityVariant(apt.priority)}>{apt.priority}</Badge>
            </div>
          ))}
        </div>
      </Card>

      {/* Table view */}
      <Card className="overflow-hidden">
        <div className="border-b border-slate-200 px-5 py-3">
          <h2 className="text-sm font-bold text-slate-800">Schedule Table</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-slate-50 text-left text-xs text-slate-400">
              <tr>
                <th className="px-4 py-3 font-medium">Time</th>
                <th className="px-4 py-3 font-medium">Patient</th>
                <th className="px-4 py-3 font-medium">Priority</th>
                <th className="px-4 py-3 font-medium">Doctor</th>
                <th className="px-4 py-3 font-medium">Room</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {SCHEDULE.map((apt, i) => (
                <tr key={i} className="transition-colors hover:bg-slate-50">
                  <td className="px-4 py-3 font-medium text-teal-700">{apt.time}</td>
                  <td className="px-4 py-3 font-medium text-slate-700">{apt.patient}</td>
                  <td className="px-4 py-3"><Badge variant={priorityVariant(apt.priority)}>{apt.priority}</Badge></td>
                  <td className="px-4 py-3 text-slate-500">{apt.doctor}</td>
                  <td className="px-4 py-3 text-slate-500">{apt.room}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </StaffLayout>
  );
}
