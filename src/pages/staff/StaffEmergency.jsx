import { useState } from 'react';
import {
  AlertTriangle,
  Plus,
  CheckCircle,
  Loader2,
  Heart,
  Zap,
} from 'lucide-react';
import StaffLayout from '@/layouts/StaffLayout';
import PageHeader from '@/components/PageHeader';
import Card from '@/components/Card';
import Button from '@/components/Button';
import Badge from '@/components/Badge';
import { Input, Select } from '@/components/FormFields';
import { SCHEDULE, PROBLEM_GROUPS, getDepartmentForProblem, getDoctorForDepartment, getRoomForDepartment } from '@/data/hospitalData';
import { emergencyReoptimization } from '@/services/optimizationService';
import { priorityVariant } from '@/utils/helpers';

export default function StaffEmergency() {
  const [form, setForm] = useState({
    name: 'Emergency Patient',
    problem: 'Chest pain',
    priority: 'Emergency',
  });
  const [phase, setPhase] = useState('form'); // form | running | result
  const [steps, setSteps] = useState([]);
  const [updatedSchedule, setUpdatedSchedule] = useState(null);

  const handleChange = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleAddEmergency = async () => {
    setPhase('running');
    setSteps([]);

    const dept = getDepartmentForProblem(form.problem);
    const doctor = getDoctorForDepartment(dept);
    const room = getRoomForDepartment(dept);

    const emergencyPatient = {
      ...form,
      department: dept,
      doctor: doctor.name,
      room: room.name,
    };

    const result = await emergencyReoptimization(emergencyPatient, (stepIdx, label) => {
      setSteps((prev) => [...prev, label]);
    });

    setUpdatedSchedule(result.schedule);
    setPhase('result');
  };

  return (
    <StaffLayout>
      <PageHeader
        title="Emergency Re-optimization"
        subtitle="Add an emergency patient and re-optimize the schedule"
        icon={AlertTriangle}
      />

      {/* Disclaimer */}
      <div className="mb-6 rounded-lg border border-amber-200 bg-amber-50 px-4 py-3">
        <p className="text-sm text-amber-700">
          <strong>Frontend Simulation:</strong> The re-optimization is simulated in the frontend
          using synthetic data. This demonstrates the workflow — a real backend will be connected later.
        </p>
      </div>

      {phase === 'form' && (
        <Card className="max-w-lg p-6">
          <div className="mb-4 flex items-center gap-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-red-50">
              <Zap className="text-red-600" size={20} />
            </div>
            <div>
              <h2 className="text-sm font-bold text-slate-800">Add Emergency Patient</h2>
              <p className="text-xs text-slate-500">Trigger emergency re-optimization</p>
            </div>
          </div>

          <div className="space-y-4">
            <Input
              label="Patient Name"
              value={form.name}
              onChange={(e) => handleChange('name', e.target.value)}
            />
            <Select
              label="Problem"
              value={form.problem}
              onChange={(e) => handleChange('problem', e.target.value)}
            >
              {PROBLEM_GROUPS.map((group) => (
                <optgroup key={group.department} label={group.department}>
                  {group.problems.map((p) => (
                    <option key={p} value={p}>{p}</option>
                  ))}
                </optgroup>
              ))}
            </Select>
            <div className="rounded-lg bg-red-50 px-4 py-2.5">
              <p className="text-xs text-red-600">
                <strong>Priority: Emergency</strong> — This patient will be inserted at the
                earliest available slot and the schedule will be re-optimized.
              </p>
            </div>
            <Button onClick={handleAddEmergency} variant="danger" size="lg" className="w-full">
              <Plus size={18} />
              Add Emergency Patient
            </Button>
          </div>
        </Card>
      )}

      {phase === 'running' && (
        <Card className="max-w-lg p-8 text-center">
          <Loader2 className="mx-auto mb-4 animate-spin text-red-600" size={36} />
          <h2 className="text-base font-semibold text-slate-800">Re-optimizing schedule...</h2>
          <div className="mt-4 space-y-2 text-left">
            {steps.map((step, i) => (
              <div key={i} className="flex items-center gap-2 text-sm text-slate-600">
                <CheckCircle size={16} className="text-teal-600" />
                {step}
              </div>
            ))}
          </div>
        </Card>
      )}

      {phase === 'result' && updatedSchedule && (
        <div className="animate-slide-up">
          {/* Result banner */}
          <Card className="mb-5 border-teal-200 p-5">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-teal-100">
                <CheckCircle className="text-teal-600" size={24} />
              </div>
              <div>
                <h2 className="text-base font-bold text-slate-800">Re-optimization Complete</h2>
                <p className="text-sm text-slate-500">
                  Emergency patient inserted. Schedule updated and validated.
                </p>
              </div>
              <Badge variant="confirmed" className="ml-auto">PASS</Badge>
            </div>
          </Card>

          {/* Updated schedule */}
          <Card className="overflow-hidden">
            <div className="border-b border-slate-200 bg-slate-50 px-5 py-3">
              <h3 className="text-sm font-bold text-slate-800">Updated Schedule</h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-slate-50/50 text-left text-xs text-slate-400">
                  <tr>
                    <th className="px-4 py-3 font-medium">Time</th>
                    <th className="px-4 py-3 font-medium">Patient</th>
                    <th className="px-4 py-3 font-medium">Priority</th>
                    <th className="px-4 py-3 font-medium">Doctor</th>
                    <th className="px-4 py-3 font-medium">Room</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {updatedSchedule.map((apt, i) => (
                    <tr
                      key={i}
                      className={apt.priority === 'Emergency' ? 'bg-red-50/50' : 'transition-colors hover:bg-slate-50'}
                    >
                      <td className="px-4 py-3 font-medium text-teal-700">{apt.time}</td>
                      <td className="px-4 py-3 font-medium text-slate-700">
                        {apt.priority === 'Emergency' && <Heart size={12} className="mr-1 inline text-red-500" />}
                        {apt.patient}
                      </td>
                      <td className="px-4 py-3"><Badge variant={priorityVariant(apt.priority)}>{apt.priority}</Badge></td>
                      <td className="px-4 py-3 text-slate-500">{apt.doctor}</td>
                      <td className="px-4 py-3 text-slate-500">{apt.room}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>

          <div className="mt-5 flex gap-2">
            <Button variant="secondary" onClick={() => { setPhase('form'); setUpdatedSchedule(null); setSteps([]); }}>
              Add Another Emergency
            </Button>
          </div>
        </div>
      )}

      {/* Current schedule reference */}
      {phase === 'form' && (
        <Card className="mt-5 p-5">
          <h2 className="mb-3 text-sm font-bold text-slate-800">Current Schedule (before re-optimization)</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="text-left text-xs text-slate-400">
                <tr className="border-b border-slate-200">
                  <th className="pb-2 pr-4 font-medium">Time</th>
                  <th className="pb-2 pr-4 font-medium">Patient</th>
                  <th className="pb-2 pr-4 font-medium">Priority</th>
                  <th className="pb-2 pr-4 font-medium">Doctor</th>
                  <th className="pb-2 font-medium">Room</th>
                </tr>
              </thead>
              <tbody>
                {SCHEDULE.map((apt, i) => (
                  <tr key={i} className="border-b border-slate-100 last:border-0">
                    <td className="py-2 pr-4 font-medium text-teal-700">{apt.time}</td>
                    <td className="py-2 pr-4 text-slate-700">{apt.patient}</td>
                    <td className="py-2 pr-4"><Badge variant={priorityVariant(apt.priority)}>{apt.priority}</Badge></td>
                    <td className="py-2 pr-4 text-slate-500">{apt.doctor}</td>
                    <td className="py-2 text-slate-500">{apt.room}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}
    </StaffLayout>
  );
}
