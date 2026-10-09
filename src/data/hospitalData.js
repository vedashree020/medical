// ============================================================
// QMedSync — Synthetic Hospital Data (Frontend Prototype)
// All data is synthetic / demo data. No real patient data.
// ============================================================

export const DEPARTMENTS = [
  { id: 'cardiology', name: 'Cardiology', floor: '1st Floor' },
  { id: 'neurology', name: 'Neurology', floor: '1st Floor' },
  { id: 'orthopedics', name: 'Orthopedics', floor: '2nd Floor' },
  { id: 'emergency', name: 'Emergency', floor: 'Ground Floor' },
];

export const PROBLEM_MAP = [
  { problem: 'Chest pain', department: 'Cardiology' },
  { problem: 'Heart-related complaint', department: 'Cardiology' },
  { problem: 'ECG follow-up', department: 'Cardiology' },
  { problem: 'Headache', department: 'Neurology' },
  { problem: 'Dizziness', department: 'Neurology' },
  { problem: 'Neurological complaint', department: 'Neurology' },
  { problem: 'Joint pain', department: 'Orthopedics' },
  { problem: 'Bone injury', department: 'Orthopedics' },
  { problem: 'Back pain', department: 'Orthopedics' },
];

export const PROBLEM_GROUPS = [
  {
    department: 'Cardiology',
    problems: ['Chest pain', 'Heart-related complaint', 'ECG follow-up'],
  },
  {
    department: 'Neurology',
    problems: ['Headache', 'Dizziness', 'Neurological complaint'],
  },
  {
    department: 'Orthopedics',
    problems: ['Joint pain', 'Bone injury', 'Back pain'],
  },
];

export const DOCTORS = [
  {
    id: 'doc-1',
    name: 'Dr. Priya',
    specialty: 'Cardiology',
    availability: '09:00 AM – 01:00 PM',
    slots: ['09:00 AM', '10:00 AM', '10:30 AM', '11:00 AM', '11:30 AM'],
    status: 'Available',
  },
  {
    id: 'doc-2',
    name: 'Dr. Rahul',
    specialty: 'Neurology',
    availability: '09:00 AM – 01:00 PM',
    slots: ['09:30 AM', '10:30 AM', '11:15 AM', '12:00 PM', '12:30 PM'],
    status: 'Available',
  },
  {
    id: 'doc-3',
    name: 'Dr. Anjali',
    specialty: 'Orthopedics',
    availability: '09:00 AM – 01:00 PM',
    slots: ['10:00 AM', '10:45 AM', '11:30 AM', '12:15 PM', '01:00 PM'],
    status: 'Available',
  },
];

export const ROOMS = [
  {
    id: 'room-1',
    name: 'Cardiology Room',
    department: 'Cardiology',
    floor: '1st Floor',
    equipment: ['ECG', 'Monitoring'],
    available: true,
    currentAssignment: null,
  },
  {
    id: 'room-2',
    name: 'General Room',
    department: 'Neurology',
    floor: '1st Floor',
    equipment: ['Monitoring'],
    available: true,
    currentAssignment: null,
  },
  {
    id: 'room-3',
    name: 'Orthopedic Room',
    department: 'Orthopedics',
    floor: '2nd Floor',
    equipment: ['X-Ray', 'General'],
    available: true,
    currentAssignment: null,
  },
];

export const INITIAL_PATIENTS = [
  {
    id: 'pat-1',
    name: 'Aarav Sharma',
    age: 45,
    gender: 'Male',
    problem: 'Chest pain',
    department: 'Cardiology',
    priority: 'Emergency',
    status: 'Scheduled',
    doctor: 'Dr. Priya',
    room: 'Cardiology Room',
    floor: '1st Floor',
    time: '09:00 AM',
    date: '2026-10-08',
  },
  {
    id: 'pat-2',
    name: 'Diya Patel',
    age: 32,
    gender: 'Female',
    problem: 'Dizziness',
    department: 'Neurology',
    priority: 'Urgent',
    status: 'Scheduled',
    doctor: 'Dr. Rahul',
    room: 'General Room',
    floor: '1st Floor',
    time: '10:30 AM',
    date: '2026-10-08',
  },
  {
    id: 'pat-3',
    name: 'Rohan Kumar',
    age: 55,
    gender: 'Male',
    problem: 'ECG follow-up',
    department: 'Cardiology',
    priority: 'Routine',
    status: 'Scheduled',
    doctor: 'Dr. Priya',
    room: 'Cardiology Room',
    floor: '1st Floor',
    time: '10:00 AM',
    date: '2026-10-08',
  },
  {
    id: 'pat-4',
    name: 'Ananya Rao',
    age: 28,
    gender: 'Female',
    problem: 'Joint pain',
    department: 'Orthopedics',
    priority: 'Routine',
    status: 'Scheduled',
    doctor: 'Dr. Anjali',
    room: 'Orthopedic Room',
    floor: '2nd Floor',
    time: '10:00 AM',
    date: '2026-10-08',
  },
  {
    id: 'pat-5',
    name: 'Vikram Singh',
    age: 50,
    gender: 'Male',
    problem: 'Heart-related complaint',
    department: 'Cardiology',
    priority: 'Urgent',
    status: 'Scheduled',
    doctor: 'Dr. Priya',
    room: 'Cardiology Room',
    floor: '1st Floor',
    time: '10:30 AM',
    date: '2026-10-08',
  },
  {
    id: 'pat-6',
    name: 'Meera Nair',
    age: 38,
    gender: 'Female',
    problem: 'Headache',
    department: 'Neurology',
    priority: 'Routine',
    status: 'Scheduled',
    doctor: 'Dr. Rahul',
    room: 'General Room',
    floor: '1st Floor',
    time: '09:30 AM',
    date: '2026-10-08',
  },
];

export const SCHEDULE = [
  {
    time: '09:00 – 10:00',
    patient: 'Aarav Sharma',
    priority: 'Emergency',
    doctor: 'Dr. Priya',
    room: 'Cardiology Room',
  },
  {
    time: '09:30 – 10:00',
    patient: 'Meera Nair',
    priority: 'Routine',
    doctor: 'Dr. Rahul',
    room: 'General Room',
  },
  {
    time: '10:00 – 10:30',
    patient: 'Rohan Kumar',
    priority: 'Routine',
    doctor: 'Dr. Priya',
    room: 'Cardiology Room',
  },
  {
    time: '10:00 – 10:45',
    patient: 'Ananya Rao',
    priority: 'Routine',
    doctor: 'Dr. Anjali',
    room: 'Orthopedic Room',
  },
  {
    time: '10:30 – 11:15',
    patient: 'Diya Patel',
    priority: 'Urgent',
    doctor: 'Dr. Rahul',
    room: 'General Room',
  },
  {
    time: '10:30 – 11:00',
    patient: 'Vikram Singh',
    priority: 'Urgent',
    doctor: 'Dr. Priya',
    room: 'Cardiology Room',
  },
];

// Floor plan for indoor navigation
export const FLOOR_PLAN = [
  {
    floor: 'Ground Floor',
    floorNumber: 0,
    rooms: [
      { id: 'reception', name: 'Reception', x: 50, y: 50 },
      { id: 'emergency', name: 'Emergency', x: 200, y: 50 },
      { id: 'pharmacy', name: 'Pharmacy', x: 350, y: 50 },
      { id: 'billing', name: 'Billing', x: 50, y: 180 },
      { id: 'waiting', name: 'Waiting Area', x: 200, y: 180 },
      { id: 'lift', name: 'Lift', x: 350, y: 180 },
    ],
  },
  {
    floor: '1st Floor',
    floorNumber: 1,
    rooms: [
      { id: 'room-10', name: 'Room 10', x: 50, y: 50 },
      { id: 'room-11', name: 'Room 11', x: 200, y: 50 },
      { id: 'room-12', name: 'Room 12', x: 350, y: 50 },
      { id: 'cardiology', name: 'Cardiology', x: 50, y: 180 },
      { id: 'neurology', name: 'Neurology', x: 200, y: 180 },
      { id: 'lift-1', name: 'Lift', x: 350, y: 180 },
    ],
  },
  {
    floor: '2nd Floor',
    floorNumber: 2,
    rooms: [
      { id: 'icu', name: 'ICU', x: 50, y: 50 },
      { id: 'radiology', name: 'Radiology', x: 200, y: 50 },
      { id: 'surgery', name: 'Surgery', x: 350, y: 50 },
      { id: 'orthopedics', name: 'Orthopedics', x: 50, y: 180 },
      { id: 'lift-2', name: 'Lift', x: 350, y: 180 },
    ],
  },
];

// Predefined navigation routes from Reception
export const NAVIGATION_ROUTES = {
  Reception: [],
  Emergency: [
    { step: 'Reception', detail: 'Starting point' },
    { step: 'Emergency', detail: 'Ground Floor — walk straight ahead' },
  ],
  Pharmacy: [
    { step: 'Reception', detail: 'Starting point' },
    { step: 'Right Corridor', detail: 'Turn right from Reception' },
    { step: 'Pharmacy', detail: 'Ground Floor — on your right' },
  ],
  Billing: [
    { step: 'Reception', detail: 'Starting point' },
    { step: 'Left Corridor', detail: 'Turn left from Reception' },
    { step: 'Billing', detail: 'Ground Floor — on your left' },
  ],
  'Waiting Area': [
    { step: 'Reception', detail: 'Starting point' },
    { step: 'Waiting Area', detail: 'Ground Floor — straight ahead' },
  ],
  'Room 10': [
    { step: 'Reception', detail: 'Starting point' },
    { step: 'Lift', detail: 'Take the lift to 1st Floor' },
    { step: '1st Floor', detail: 'Exit lift' },
    { step: 'Left Corridor', detail: 'Turn left' },
    { step: 'Room 10', detail: '1st Floor — first door on the left' },
  ],
  'Room 11': [
    { step: 'Reception', detail: 'Starting point' },
    { step: 'Lift', detail: 'Take the lift to 1st Floor' },
    { step: '1st Floor', detail: 'Exit lift' },
    { step: 'Right Corridor', detail: 'Turn right' },
    { step: 'Room 11', detail: '1st Floor — first door on the right' },
  ],
  'Room 12': [
    { step: 'Reception', detail: 'Starting point' },
    { step: 'Lift', detail: 'Take the lift to 1st Floor' },
    { step: '1st Floor', detail: 'Exit lift' },
    { step: 'Right Corridor', detail: 'Turn right' },
    { step: 'Room 12', detail: '1st Floor — second door on the right' },
  ],
  Cardiology: [
    { step: 'Reception', detail: 'Starting point' },
    { step: 'Lift', detail: 'Take the lift to 1st Floor' },
    { step: '1st Floor', detail: 'Exit lift' },
    { step: 'Right Corridor', detail: 'Turn right' },
    { step: 'Cardiology Room', detail: '1st Floor — end of corridor' },
  ],
  'Cardiology Room': [
    { step: 'Reception', detail: 'Starting point' },
    { step: 'Lift', detail: 'Take the lift to 1st Floor' },
    { step: '1st Floor', detail: 'Exit lift' },
    { step: 'Right Corridor', detail: 'Turn right' },
    { step: 'Cardiology Room', detail: '1st Floor — end of corridor' },
  ],
  Neurology: [
    { step: 'Reception', detail: 'Starting point' },
    { step: 'Lift', detail: 'Take the lift to 1st Floor' },
    { step: '1st Floor', detail: 'Exit lift' },
    { step: 'Right Corridor', detail: 'Turn right' },
    { step: 'General Room', detail: '1st Floor — beside Cardiology' },
  ],
  'General Room': [
    { step: 'Reception', detail: 'Starting point' },
    { step: 'Lift', detail: 'Take the lift to 1st Floor' },
    { step: '1st Floor', detail: 'Exit lift' },
    { step: 'Right Corridor', detail: 'Turn right' },
    { step: 'General Room', detail: '1st Floor — beside Cardiology' },
  ],
  ICU: [
    { step: 'Reception', detail: 'Starting point' },
    { step: 'Lift', detail: 'Take the lift to 2nd Floor' },
    { step: '2nd Floor', detail: 'Exit lift' },
    { step: 'Left Corridor', detail: 'Turn left' },
    { step: 'ICU', detail: '2nd Floor — first door on the left' },
  ],
  Radiology: [
    { step: 'Reception', detail: 'Starting point' },
    { step: 'Lift', detail: 'Take the lift to 2nd Floor' },
    { step: '2nd Floor', detail: 'Exit lift' },
    { step: 'Right Corridor', detail: 'Turn right' },
    { step: 'Radiology', detail: '2nd Floor — first door on the right' },
  ],
  Surgery: [
    { step: 'Reception', detail: 'Starting point' },
    { step: 'Lift', detail: 'Take the lift to 2nd Floor' },
    { step: '2nd Floor', detail: 'Exit lift' },
    { step: 'Right Corridor', detail: 'Turn right' },
    { step: 'Surgery', detail: '2nd Floor — end of corridor' },
  ],
  Orthopedics: [
    { step: 'Reception', detail: 'Starting point' },
    { step: 'Lift', detail: 'Take the lift to 2nd Floor' },
    { step: '2nd Floor', detail: 'Exit lift' },
    { step: 'Left Corridor', detail: 'Turn left' },
    { step: 'Orthopedic Room', detail: '2nd Floor — end of left corridor' },
  ],
  'Orthopedic Room': [
    { step: 'Reception', detail: 'Starting point' },
    { step: 'Lift', detail: 'Take the lift to 2nd Floor' },
    { step: '2nd Floor', detail: 'Exit lift' },
    { step: 'Left Corridor', detail: 'Turn left' },
    { step: 'Orthopedic Room', detail: '2nd Floor — end of left corridor' },
  ],
};

export const QUBO_DATA = {
  variables: 60,
  terms: 538,
  patients: 6,
  doctors: 3,
  rooms: 3,
};

export const OPTIMIZATION_PIPELINE = [
  { id: 1, label: 'Patient Data', icon: 'Users' },
  { id: 2, label: 'Feasible Assignments', icon: 'ListChecks' },
  { id: 3, label: 'QUBO Formulation', icon: 'Binary' },
  { id: 4, label: 'Hybrid Optimization', icon: 'Cpu' },
  { id: 5, label: 'Validation', icon: 'CheckCircle' },
  { id: 6, label: 'Final Schedule', icon: 'CalendarCheck' },
];

export const OPTIMIZATION_STEPS = [
  { id: 1, label: 'Loading hospital data...', duration: 700 },
  { id: 2, label: 'Generating feasible assignments...', duration: 800 },
  { id: 3, label: 'Building QUBO...', duration: 900 },
  { id: 4, label: 'Running simulated annealing...', duration: 1000 },
  { id: 5, label: 'Running QAOA proof-of-concept...', duration: 1100 },
  { id: 6, label: 'Validating schedule...', duration: 700 },
  { id: 7, label: 'Schedule generated.', duration: 500 },
];

export const LOADING_MESSAGES = [
  'Analyzing available doctors...',
  'Checking room availability...',
  'Optimizing assignment...',
  'Preparing appointment...',
];

// Helper: map a problem string to a department
export function getDepartmentForProblem(problem) {
  const entry = PROBLEM_MAP.find((p) => p.problem === problem);
  return entry ? entry.department : 'Cardiology';
}

// Helper: find a suitable doctor for a department
export function getDoctorForDepartment(department) {
  const doctor = DOCTORS.find((d) => d.specialty === department);
  return doctor || DOCTORS[0];
}

// Helper: find a suitable room for a department
export function getRoomForDepartment(department) {
  const room = ROOMS.find((r) => r.department === department);
  return room || ROOMS[0];
}

// Helper: pick the first available slot for a doctor based on priority
export function getSlotForDoctor(doctor, priority) {
  if (!doctor || !doctor.slots) return '09:00 AM';
  if (priority === 'Emergency') return doctor.slots[0];
  if (priority === 'Urgent') return doctor.slots[1] || doctor.slots[0];
  return doctor.slots[2] || doctor.slots[1] || doctor.slots[0];
}
