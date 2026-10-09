import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Loader2, CheckCircle } from 'lucide-react';
import PatientLayout from '@/layouts/PatientLayout';
import Button from '@/components/Button';
import { Input, Select } from '@/components/FormFields';
import Card from '@/components/Card';
import Badge from '@/components/Badge';
import { PROBLEM_GROUPS, LOADING_MESSAGES, getDepartmentForProblem, getDoctorForDepartment, getRoomForDepartment, getSlotForDoctor } from '@/data/hospitalData';
import { saveData, loadData } from '@/services/storageService';
import { getSession } from '@/services/authService';
import { priorityVariant } from '@/utils/helpers';

export default function FindAppointment() {
  const navigate = useNavigate();
  const session = getSession();
  const [form, setForm] = useState({
    name: session?.name || '',
    age: '',
    gender: '',
    problem: '',
    priority: 'Routine',
  });
  const [phase, setPhase] = useState('form'); // form | loading | result
  const [loadingMsgIndex, setLoadingMsgIndex] = useState(0);
  const [result, setResult] = useState(null);
  const [existingAppointment, setExistingAppointment] = useState(null);

  useEffect(() => {
    const saved = loadData('patientAppointment', null);
    if (saved) setExistingAppointment(saved);
  }, []);

  const handleChange = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.name || !form.age || !form.problem) return;
    setPhase('loading');
    setLoadingMsgIndex(0);

    // Simulate optimization loading
    let idx = 0;
    const interval = setInterval(() => {
      idx++;
      if (idx < LOADING_MESSAGES.length) {
        setLoadingMsgIndex(idx);
      }
    }, 800);

    setTimeout(() => {
      clearInterval(interval);
      const dept = getDepartmentForProblem(form.problem);
      const doctor = getDoctorForDepartment(dept);
      const room = getRoomForDepartment(dept);
      const slot = getSlotForDoctor(doctor, form.priority);

      const appointment = {
        patient: form.name,
        age: form.age,
        gender: form.gender,
        problem: form.problem,
        department: dept,
        doctor: doctor.name,
        room: room.name,
        floor: room.floor,
        time: slot,
        priority: form.priority,
        status: 'Confirmed',
        date: new Date().toISOString().split('T')[0],
      };

      saveData('patientAppointment', appointment);
      setResult(appointment);
      setPhase('result');
    }, LOADING_MESSAGES.length * 800 + 400);
  };

  if (phase === 'loading') {
    return (
      <PatientLayout>
        <div className="flex min-h-[60vh] flex-col items-center justify-center">
          <div className="w-full max-w-md rounded-xl border border-slate-200 bg-white p-8 text-center shadow-sm">
            <Loader2 className="mx-auto mb-4 animate-spin text-teal-600" size={36} />
            <h2 className="text-base font-semibold text-slate-800">Finding your appointment...</h2>
            <div className="mt-4 space-y-2">
              {LOADING_MESSAGES.map((msg, i) => (
                <div
                  key={i}
                  className={`flex items-center justify-center gap-2 text-sm transition-all ${
                    i < loadingMsgIndex
                      ? 'text-teal-600'
                      : i === loadingMsgIndex
                      ? 'text-slate-700'
                      : 'text-slate-300'
                  }`}
                >
                  {i < loadingMsgIndex ? (
                    <CheckCircle size={16} />
                  ) : i === loadingMsgIndex ? (
                    <Loader2 className="animate-spin" size={16} />
                  ) : (
                    <div className="h-4 w-4 rounded-full border-2 border-slate-200" />
                  )}
                  {msg}
                </div>
              ))}
            </div>
          </div>
        </div>
      </PatientLayout>
    );
  }

  if (phase === 'result' && result) {
    return (
      <PatientLayout>
        <div className="mx-auto max-w-2xl">
          <div className="mb-4 flex items-center gap-2">
            <CheckCircle className="text-teal-600" size={24} />
            <h1 className="text-lg font-bold text-slate-800">Your Appointment</h1>
          </div>

          <Card className="overflow-hidden">
            <div className="border-b border-slate-200 bg-teal-50 px-6 py-4">
              <div className="flex items-center justify-between">
                <p className="text-sm font-bold text-teal-800">APPOINTMENT CONFIRMED</p>
                <Badge variant="confirmed">{result.status}</Badge>
              </div>
            </div>
            <div className="grid gap-4 p-6 sm:grid-cols-2">
              <InfoRow label="Patient" value={result.patient} />
              <InfoRow label="Department" value={result.department} />
              <InfoRow label="Doctor" value={result.doctor} />
              <InfoRow label="Room" value={result.room} />
              <InfoRow label="Floor" value={result.floor} />
              <InfoRow label="Time" value={result.time} />
              <InfoRow label="Priority" value={
                <Badge variant={priorityVariant(result.priority)}>{result.priority}</Badge>
              } />
              <InfoRow label="Status" value={
                <Badge variant="confirmed">{result.status}</Badge>
              } />
            </div>
            <div className="flex flex-wrap gap-2 border-t border-slate-200 px-6 py-4">
              <Button variant="secondary" onClick={() => navigate('/patient/find-room')}>
                View Room
              </Button>
              <Button variant="secondary" onClick={() => navigate('/patient/appointment')}>
                View Appointment
              </Button>
              <Button onClick={() => navigate('/patient/find-room')}>
                Start Navigation
              </Button>
            </div>
          </Card>

          <div className="mt-4 flex gap-2">
            <Button variant="ghost" onClick={() => setPhase('form')}>
              Book Another Appointment
            </Button>
          </div>
        </div>
      </PatientLayout>
    );
  }

  // Default form
  return (
    <PatientLayout>
      <div className="mx-auto max-w-2xl">
        <div className="mb-5">
          <h1 className="text-lg font-bold text-slate-800">Find My Appointment</h1>
          <p className="mt-0.5 text-sm text-slate-500">
            Enter your details and problem. QMedSync will identify the right department, doctor, room and time slot.
          </p>
        </div>

        {existingAppointment && (
          <Card className="mb-4 border-teal-200 bg-teal-50/50 p-4">
            <div className="flex items-center justify-between">
              <p className="text-sm text-slate-600">
                You already have an appointment with{' '}
                <span className="font-semibold">{existingAppointment.doctor}</span> at{' '}
                <span className="font-semibold">{existingAppointment.time}</span>.
              </p>
              <Button size="sm" variant="ghost" onClick={() => {
                setResult(existingAppointment);
                setPhase('result');
              }}>
                View
              </Button>
            </div>
          </Card>
        )}

        <Card className="p-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <Input
                label="Patient Name"
                placeholder="Enter your full name"
                value={form.name}
                onChange={(e) => handleChange('name', e.target.value)}
                required
              />
              <Input
                label="Age"
                type="number"
                min="0"
                max="120"
                placeholder="Enter age"
                value={form.age}
                onChange={(e) => handleChange('age', e.target.value)}
                required
              />
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <Select
                label="Gender"
                value={form.gender}
                onChange={(e) => handleChange('gender', e.target.value)}
              >
                <option value="">Select gender</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </Select>
              <Select
                label="Priority"
                value={form.priority}
                onChange={(e) => handleChange('priority', e.target.value)}
              >
                <option value="Routine">Routine</option>
                <option value="Urgent">Urgent</option>
                <option value="Emergency">Emergency</option>
              </Select>
            </div>
            <Select
              label="Select Problem / Symptoms"
              value={form.problem}
              onChange={(e) => handleChange('problem', e.target.value)}
              required
            >
              <option value="">Select your problem</option>
              {PROBLEM_GROUPS.map((group) => (
                <optgroup key={group.department} label={group.department}>
                  {group.problems.map((p) => (
                    <option key={p} value={p}>{p}</option>
                  ))}
                </optgroup>
              ))}
            </Select>

            <div className="rounded-lg bg-slate-50 px-4 py-3">
              <p className="text-xs text-slate-500">
                Based on the selected problem, QMedSync identifies the appropriate department and
                assigns a suitable doctor, room and time slot.
              </p>
            </div>

            <Button type="submit" size="lg" className="w-full">
              <Search size={18} />
              Find Doctor & Room
            </Button>
          </form>
        </Card>
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
