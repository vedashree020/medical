import { useState } from 'react';
import {
  Cpu,
  Binary,
  Play,
  CheckCircle,
  Users,
  ListChecks,
  Atom,
  FlaskConical,
  CalendarCheck,
  ArrowRight,
  Activity,
} from 'lucide-react';
import StaffLayout from '@/layouts/StaffLayout';
import PageHeader from '@/components/PageHeader';
import Card from '@/components/Card';
import Button from '@/components/Button';
import Badge from '@/components/Badge';
import ProgressBar from '@/components/ProgressBar';
import { OPTIMIZATION_PIPELINE, SCHEDULE } from '@/data/hospitalData';
import { runOptimization, getQuboData, runQuantumDemo, validateSchedule } from '@/services/optimizationService';
import { priorityVariant } from '@/utils/helpers';

const PIPELINE_ICONS = {
  Users,
  ListChecks,
  Binary,
  Cpu,
  CheckCircle,
  CalendarCheck,
};

export default function StaffOptimization() {
  const qubo = getQuboData();
  const [running, setRunning] = useState(false);
  const [progress, setProgress] = useState(0);
  const [currentStep, setCurrentStep] = useState('');
  [SCHEDULE, priorityVariant];
  const [completedSteps, setCompletedSteps] = useState([]);
  const [result, setResult] = useState(null);
  const [quantumRunning, setQuantumRunning] = useState(false);
  const [quantumResult, setQuantumResult] = useState(null);
  const [quantumSteps, setQuantumSteps] = useState([]);

  const handleRunOptimization = async () => {
    setRunning(true);
    setProgress(0);
    setCompletedSteps([]);
    setResult(null);

    await runOptimization((stepIdx, label) => {
      setCurrentStep(label);
      setProgress(((stepIdx + 1) / 7) * 100);
      setCompletedSteps((prev) => [...prev, label]);
    });

    const validation = validateSchedule(SCHEDULE);
    setResult(validation);
    setRunning(false);
  };

  const handleRunQuantum = async () => {
    setQuantumRunning(true);
    setQuantumSteps([]);
    setQuantumResult(null);

    await runQuantumDemo((stepIdx, label) => {
      setQuantumSteps((prev) => [...prev, { idx: stepIdx, label }]);
    });

    const qResult = await runQuantumDemo(() => {});
    setQuantumResult(qResult);
    setQuantumRunning(false);
  };

  return (
    <StaffLayout>
      <PageHeader
        title="Optimization"
        subtitle="Hybrid classical + quantum scheduling pipeline"
        icon={Cpu}
      />

      {/* Disclaimer */}
      <div className="mb-6 rounded-lg border border-amber-200 bg-amber-50 px-4 py-3">
        <p className="text-sm text-amber-700">
          <strong>Demo Prototype:</strong> The optimization is simulated in the frontend. QAOA is
          labeled as a Quantum Proof-of-Concept. No quantum advantage, quantum supremacy, or
          production quantum optimization is claimed.
        </p>
      </div>

      {/* QUBO metrics */}
      <div className="mb-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
        <MetricCard icon={Binary} label="QUBO Variables" value={qubo.variables} />
        <MetricCard icon={Binary} label="QUBO Terms" value={qubo.terms} />
        <MetricCard icon={Users} label="Patients" value={qubo.patients} />
        <MetricCard icon={Activity} label="Doctors" value={qubo.doctors} />
        <MetricCard icon={Activity} label="Rooms" value={qubo.rooms} />
      </div>

      {/* Pipeline visualization */}
      <Card className="mb-6 p-5">
        <h2 className="mb-4 text-sm font-bold text-slate-800">Optimization Pipeline</h2>
        <div className="flex flex-col items-stretch gap-2 lg:flex-row lg:items-center">
          {OPTIMIZATION_PIPELINE.map((stage, i) => {
            const Icon = PIPELINE_ICONS[stage.icon] || Activity;
            return (
              <div key={stage.id} className="flex items-center gap-2 lg:flex-1">
                <div className="flex flex-1 flex-col items-center rounded-lg border border-slate-200 bg-slate-50 p-3 text-center">
                  <div className="mb-1.5 flex h-9 w-9 items-center justify-center rounded-lg bg-teal-100 text-teal-600">
                    <Icon size={18} />
                  </div>
                  <p className="text-xs font-medium text-slate-600">{stage.label}</p>
                </div>
                {i < OPTIMIZATION_PIPELINE.length - 1 && (
                  <ArrowRight className="hidden shrink-0 text-slate-300 lg:block" size={18} />
                )}
              </div>
            );
          })}
        </div>
      </Card>

      {/* Two optimization components */}
      <div className="mb-6 grid gap-5 lg:grid-cols-2">
        {/* Classical */}
        <Card className="p-5">
          <div className="mb-3 flex items-center gap-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-sky-50">
              <Cpu className="text-sky-600" size={20} />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-800">Classical</h3>
              <p className="text-xs text-slate-500">Simulated Annealing</p>
            </div>
          </div>
          <p className="text-xs text-slate-500">
            Classical simulated annealing is used as a baseline solver for the QUBO formulation.
            It provides a reference solution for comparison.
          </p>
        </Card>

        {/* Quantum */}
        <Card className="p-5">
          <div className="mb-3 flex items-center gap-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-teal-50">
              <Atom className="text-teal-600" size={20} />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-800">Quantum</h3>
              <p className="text-xs text-slate-500">QAOA Proof-of-Concept</p>
            </div>
          </div>
          <p className="text-xs text-slate-500">
            QAOA (Quantum Approximate Optimization Algorithm) is presented as a proof-of-concept.
            This is a frontend simulation — no actual quantum hardware is used.
          </p>
        </Card>
      </div>

      {/* Run optimization */}
      <Card className="mb-6 p-5">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-sm font-bold text-slate-800">Run Optimization</h2>
          <Button onClick={handleRunOptimization} disabled={running}>
            <Play size={16} />
            {running ? 'Running...' : 'Run Optimization'}
          </Button>
        </div>

        {running && (
          <div className="mb-4">
            <ProgressBar value={progress} />
            <p className="mt-2 text-sm text-slate-600">{currentStep}</p>
          </div>
        )}

        {completedSteps.length > 0 && (
          <div className="space-y-1.5">
            {completedSteps.map((step, i) => (
              <div key={i} className="flex items-center gap-2 text-sm">
                <CheckCircle size={16} className="text-teal-600" />
                <span className="text-slate-600">{step}</span>
              </div>
            ))}
          </div>
        )}

        {result && (
          <div className="mt-4 animate-slide-up rounded-lg border border-teal-200 bg-teal-50 p-4">
            <p className="mb-3 text-sm font-bold text-teal-800">Optimization Complete</p>
            <div className="grid gap-3 sm:grid-cols-3">
              <div>
                <p className="text-xs text-slate-500">Patients Scheduled</p>
                <p className="text-lg font-bold text-teal-700">{result.patientsScheduled}</p>
              </div>
              <div>
                <p className="text-xs text-slate-500">Valid Assignments</p>
                <p className="text-lg font-bold text-teal-700">{result.validAssignments}</p>
              </div>
              <div>
                <p className="text-xs text-slate-500">Validation</p>
                <p className="text-lg font-bold text-teal-700">{result.validation}</p>
              </div>
            </div>
          </div>
        )}
      </Card>

      {/* Quantum demo */}
      <Card className="p-5">
        <div className="mb-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <FlaskConical className="text-teal-600" size={20} />
            <h2 className="text-sm font-bold text-slate-800">QAOA Proof-of-Concept Demo</h2>
          </div>
          <Button variant="secondary" onClick={handleRunQuantum} disabled={quantumRunning}>
            <Play size={16} />
            {quantumRunning ? 'Running...' : 'Run Quantum Demo'}
          </Button>
        </div>

        {quantumRunning && (
          <div className="space-y-1.5">
            {quantumSteps.map((s, i) => (
              <div key={i} className="flex items-center gap-2 text-sm">
                <CheckCircle size={16} className="text-teal-600" />
                <span className="text-slate-600">{s.label}</span>
              </div>
            ))}
          </div>
        )}

        {quantumResult && (
          <div className="mt-4 animate-slide-up rounded-lg border border-teal-200 bg-teal-50 p-4">
            <div className="grid gap-3 sm:grid-cols-2">
              <div>
                <p className="text-xs text-slate-500">Type</p>
                <p className="text-sm font-bold text-teal-700">{quantumResult.type}</p>
              </div>
              <div>
                <p className="text-xs text-slate-500">Method</p>
                <p className="text-sm font-bold text-teal-700">{quantumResult.method}</p>
              </div>
              <div>
                <p className="text-xs text-slate-500">Result</p>
                <p className="text-sm font-bold text-teal-700">{quantumResult.result}</p>
              </div>
              <div>
                <p className="text-xs text-slate-500">Energy</p>
                <p className="text-sm font-bold text-teal-700">{quantumResult.energy}</p>
              </div>
            </div>
            <p className="mt-3 text-xs text-slate-500">{quantumResult.note}</p>
          </div>
        )}
      </Card>
    </StaffLayout>
  );
}

function MetricCard({ icon: Icon, label, value }) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
      <div className="mb-2 flex h-8 w-8 items-center justify-center rounded-lg bg-slate-100 text-slate-600">
        <Icon size={16} />
      </div>
      <p className="text-xs text-slate-400">{label}</p>
      <p className="text-xl font-bold text-slate-800">{value}</p>
    </div>
  );
}
