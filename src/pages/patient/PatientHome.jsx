import { useNavigate } from 'react-router-dom';
import {
  Activity,
  Search,
  MapPin,
  Mic,
  CalendarCheck,
  ArrowRight,
  Clock,
  Stethoscope,
  DoorOpen,
  CheckCircle,
} from 'lucide-react';
import PatientLayout from '@/layouts/PatientLayout';
import { getSession } from '@/services/authService';
import { loadData } from '@/services/storageService';

export default function PatientHome() {
  const navigate = useNavigate();
  const session = getSession();
  const appointment = loadData('patientAppointment', null);

  const features = [
    {
      icon: Search,
      title: 'Find My Appointment',
      desc: 'Enter your problem — QMedSync finds the right doctor, room and time.',
      to: '/patient/appointment',
      color: 'bg-teal-50 text-teal-600',
    },
    {
      icon: MapPin,
      title: 'Find My Room',
      desc: 'Get step-by-step indoor directions to your destination.',
      to: '/patient/find-room',
      color: 'bg-sky-50 text-sky-600',
    },
    {
      icon: Mic,
      title: 'Voice Assistant',
      desc: 'Ask where your appointment is or how to find a department.',
      to: '/patient/voice',
      color: 'bg-amber-50 text-amber-600',
    },
  ];

  return (
    <PatientLayout>
      {/* Hero */}
      <div className="mb-8 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="bg-gradient-to-r from-teal-600 to-teal-700 px-6 py-10 lg:px-10 lg:py-14">
          <div className="max-w-2xl">
            <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-white/15 px-3 py-1 text-xs font-medium text-white">
              <Activity size={14} />
              QMedSync Patient Portal
            </div>
            <h1 className="text-2xl font-bold text-white lg:text-3xl">
              Enter your problem. QMedSync finds the right doctor, room and time.
            </h1>
            <p className="mt-3 text-sm text-teal-50 lg:text-base">
              Based on the selected problem, QMedSync identifies the appropriate department and
              assigns a suitable doctor, room and time slot.
            </p>
            <button
              onClick={() => navigate('/patient/appointment')}
              className="mt-6 inline-flex items-center gap-2 rounded-lg bg-white px-5 py-2.5 text-sm font-semibold text-teal-700 transition-colors hover:bg-teal-50"
            >
              Find My Appointment
              <ArrowRight size={18} />
            </button>
          </div>
        </div>
      </div>

      {/* Current appointment banner */}
      {appointment && (
        <div className="mb-6 animate-fade-in rounded-xl border border-teal-200 bg-teal-50 p-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <CalendarCheck className="text-teal-600" size={22} />
              <div>
                <p className="text-sm font-semibold text-slate-700">You have an appointment</p>
                <p className="text-xs text-slate-500">
                  {appointment.department} — {appointment.time} with {appointment.doctor}
                </p>
              </div>
            </div>
            <button
              onClick={() => navigate('/patient/appointment')}
              className="text-sm font-medium text-teal-700 hover:text-teal-800"
            >
              View →
            </button>
          </div>
        </div>
      )}

      {/* Feature cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {features.map((f) => (
          <button
            key={f.title}
            onClick={() => navigate(f.to)}
            className="group rounded-xl border border-slate-200 bg-white p-5 text-left shadow-sm transition-all hover:border-teal-200 hover:shadow-md"
          >
            <div className={`mb-3 flex h-11 w-11 items-center justify-center rounded-lg ${f.color}`}>
              <f.icon size={20} />
            </div>
            <h3 className="text-sm font-semibold text-slate-800">{f.title}</h3>
            <p className="mt-1 text-xs text-slate-500">{f.desc}</p>
            <span className="mt-3 inline-flex items-center gap-1 text-xs font-medium text-teal-600 opacity-0 transition-opacity group-hover:opacity-100">
              Open <ArrowRight size={14} />
            </span>
          </button>
        ))}
      </div>

      {/* How it works */}
      <div className="mt-8 rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="mb-4 text-sm font-bold text-slate-800">How QMedSync Works</h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
          {[
            { icon: Search, label: 'Enter Problem' },
            { icon: Stethoscope, label: 'Find Doctor' },
            { icon: DoorOpen, label: 'Find Room' },
            { icon: Clock, label: 'Assign Time' },
            { icon: CheckCircle, label: 'Get Appointment' },
          ].map((step, i) => (
            <div key={i} className="flex flex-col items-center gap-2 text-center">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-teal-50 text-teal-600">
                <step.icon size={18} />
              </div>
              <p className="text-xs font-medium text-slate-600">{step.label}</p>
            </div>
          ))}
        </div>
      </div>

      <p className="mt-6 text-center text-xs text-slate-400">
        Demo Prototype — All data is synthetic. The optimization is simulated in the frontend.
      </p>
    </PatientLayout>
  );
}
