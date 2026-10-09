import { useMemo } from 'react';
import { Stethoscope, Clock, User, CheckCircle } from 'lucide-react';
import StaffLayout from '@/layouts/StaffLayout';
import PageHeader from '@/components/PageHeader';
import Card from '@/components/Card';
import Badge from '@/components/Badge';
import StatCard from '@/components/StatCard';
import { DOCTORS, INITIAL_PATIENTS } from '@/data/hospitalData';
import { loadData, saveData } from '@/services/storageService';

export default function StaffDoctors() {
  const patients = loadData('patients', INITIAL_PATIENTS);
  saveData('patients', patients);

  const doctorData = useMemo(() => {
    return DOCTORS.map((doctor) => {
      const appointments = patients.filter((p) => p.doctor === doctor.name);
      return { ...doctor, appointments, appointmentCount: appointments.length };
    });
  }, [patients]);

  return (
    <StaffLayout>
      <PageHeader
        title="Doctors"
        subtitle="Doctor availability and current appointments"
        icon={Stethoscope}
      />

      <div className="mb-6 grid gap-4 sm:grid-cols-3">
        <StatCard icon={Stethoscope} label="Total Doctors" value={DOCTORS.length} color="teal" />
        <StatCard icon={CheckCircle} label="Available Now" value={DOCTORS.filter((d) => d.status === 'Available').length} color="green" />
        <StatCard icon={Clock} label="Total Appointments" value={doctorData.reduce((sum, d) => sum + d.appointmentCount, 0)} color="sky" />
      </div>

      <div className="grid gap-5 lg:grid-cols-2">
        {doctorData.map((doctor) => (
          <Card key={doctor.id} className="p-5">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-teal-100">
                  <Stethoscope className="text-teal-600" size={22} />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-800">{doctor.name}</h3>
                  <p className="text-sm text-slate-500">{doctor.specialty}</p>
                </div>
              </div>
              <Badge variant={doctor.status === 'Available' ? 'available' : 'default'}>
                {doctor.status}
              </Badge>
            </div>

            <div className="mt-4 grid gap-3 border-t border-slate-200 pt-4">
              <div className="flex items-center gap-2 text-sm">
                <Clock size={16} className="text-slate-400" />
                <span className="text-slate-400">Availability:</span>
                <span className="font-medium text-slate-700">{doctor.availability}</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <User size={16} className="text-slate-400" />
                <span className="text-slate-400">Appointments:</span>
                <span className="font-medium text-slate-700">{doctor.appointmentCount} today</span>
              </div>
            </div>

            {/* Appointments list */}
            {doctor.appointments.length > 0 && (
              <div className="mt-4 border-t border-slate-200 pt-4">
                <p className="mb-2 text-xs font-medium text-slate-400">Current Appointments</p>
                <div className="space-y-2">
                  {doctor.appointments.map((apt) => (
                    <div
                      key={apt.id}
                      className="flex items-center justify-between rounded-lg bg-slate-50 px-3 py-2"
                    >
                      <div>
                        <p className="text-sm font-medium text-slate-700">{apt.name}</p>
                        <p className="text-xs text-slate-400">{apt.room} — {apt.department}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-medium text-slate-500">{apt.time}</span>
                        <Badge variant={apt.priority === 'Emergency' ? 'emergency' : apt.priority === 'Urgent' ? 'urgent' : 'routine'}>
                          {apt.priority}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Available slots */}
            <div className="mt-4 border-t border-slate-200 pt-4">
              <p className="mb-2 text-xs font-medium text-slate-400">Available Time Slots</p>
              <div className="flex flex-wrap gap-1.5">
                {doctor.slots.map((slot, i) => {
                  const taken = doctor.appointments.some((a) => a.time === slot);
                  return (
                    <span
                      key={i}
                      className={`rounded-md px-2 py-1 text-xs font-medium ${
                        taken
                          ? 'bg-slate-100 text-slate-400 line-through'
                          : 'bg-teal-50 text-teal-600'
                      }`}
                    >
                      {slot}
                    </span>
                  );
                })}
              </div>
            </div>
          </Card>
        ))}
      </div>
    </StaffLayout>
  );
}
