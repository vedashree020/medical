// ============================================================
// QMedSync — Optimization Service (Frontend Simulation)
//
// These functions simulate the optimization pipeline that will
// later be replaced by calls to the QMedSync Python backend
// (FastAPI + quantum/classical optimization). The function
// signatures are designed so that a real backend can replace
// them without redesigning the frontend.
// ============================================================

import { SCHEDULE, QUBO_DATA, INITIAL_PATIENTS } from '@/data/hospitalData';

/**
 * Run the full optimization simulation.
 * Returns a promise that resolves with the final result.
 * onProgress(stepIndex, stepLabel) is called for each step.
 */
export async function runOptimization(onProgress) {
  const steps = [
    'Loading hospital data...',
    'Generating feasible assignments...',
    'Building QUBO...',
    'Running simulated annealing...',
    'Running QAOA proof-of-concept...',
    'Validating schedule...',
    'Schedule generated.',
  ];

  for (let i = 0; i < steps.length; i++) {
    if (onProgress) onProgress(i, steps[i]);
    await delay(700 + i * 150);
  }

  return {
    status: 'complete',
    patientsScheduled: 6,
    validAssignments: 6,
    validation: 'PASS',
    schedule: SCHEDULE,
  };
}

/**
 * Return the current optimization status (static for demo).
 */
export function getOptimizationStatus() {
  return {
    lastRun: '2026-10-08 09:00',
    status: 'Idle',
    patients: QUBO_DATA.patients,
    doctors: QUBO_DATA.doctors,
    rooms: QUBO_DATA.rooms,
  };
}

/**
 * Return QUBO metadata for the optimization page.
 */
export function getQuboData() {
  return {
    variables: QUBO_DATA.variables,
    terms: QUBO_DATA.terms,
    patients: QUBO_DATA.patients,
    doctors: QUBO_DATA.doctors,
    rooms: QUBO_DATA.rooms,
  };
}

/**
 * Simulate a quantum (QAOA) demonstration run.
 * Returns a promise that resolves with a proof-of-concept result.
 */
export async function runQuantumDemo(onProgress) {
  const steps = [
    'Initializing QAOA circuit...',
    'Preparing problem Hamiltonian...',
    'Applying mixing operators...',
    'Measuring circuit outcomes...',
    'Extracting best solution...',
  ];

  for (let i = 0; i < steps.length; i++) {
    if (onProgress) onProgress(i, steps[i]);
    await delay(600 + i * 100);
  }

  return {
    type: 'Quantum Proof-of-Concept',
    method: 'QAOA',
    result: 'Valid solution found',
    energy: -42.7,
    iterations: 3,
    note: 'This is a frontend simulation of QAOA. No actual quantum hardware is used.',
  };
}

/**
 * Validate the current schedule (always passes for demo).
 */
export function validateSchedule(schedule) {
  const s = schedule || SCHEDULE;
  const patients = s.length;
  const assignments = s.length;
  const hasConflict = false; // no conflicts in synthetic data
  return {
    valid: !hasConflict,
    patientsScheduled: patients,
    validAssignments: assignments,
    validation: hasConflict ? 'FAIL' : 'PASS',
  };
}

/**
 * Simulate emergency re-optimization.
 * Adds an emergency patient and re-optimizes the schedule.
 */
export async function emergencyReoptimization(emergencyPatient, onProgress) {
  const steps = [
    'Emergency case detected.',
    'Re-optimizing schedule...',
    'Rearranging doctor assignments...',
    'Checking room availability...',
    'Validating new schedule...',
    'Updated schedule ready.',
  ];

  for (let i = 0; i < steps.length; i++) {
    if (onProgress) onProgress(i, steps[i]);
    await delay(500 + i * 100);
  }

  // Prepend the emergency patient to the schedule
  const updatedSchedule = [
    {
      time: '09:00 – 09:30',
      patient: emergencyPatient.name || 'Emergency Patient',
      priority: 'Emergency',
      doctor: 'Dr. Priya',
      room: 'Cardiology Room',
    },
    ...SCHEDULE.map((s) => ({
      ...s,
      // Shift non-emergency appointments forward
      time: shiftTime(s.time),
    })),
  ];

  return {
    status: 'complete',
    emergencyPatient,
    schedule: updatedSchedule,
    validation: 'PASS',
    patientsScheduled: updatedSchedule.length,
  };
}

function shiftTime(timeRange) {
  // Simple demo shift: add 30 min to each slot
  const map = {
    '09:00 – 10:00': '09:30 – 10:30',
    '09:30 – 10:00': '10:00 – 10:30',
    '10:00 – 10:30': '10:30 – 11:00',
    '10:00 – 10:45': '10:30 – 11:15',
    '10:30 – 11:15': '11:00 – 11:45',
    '10:30 – 11:00': '11:00 – 11:30',
  };
  return map[timeRange] || timeRange;
}

function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
