# QMedSync

**Smart Patient-to-Doctor & Room Assignment**

## Problem

Hospitals need an efficient way to assign incoming patients to the right doctor, room, and time slot. Manual scheduling is slow, error-prone, and especially problematic during emergencies when rapid reassignment is needed.

## Solution

QMedSync is a hospital scheduling prototype that automates the patient-to-doctor and room assignment workflow:

1. **Patient enters their problem/symptoms**
2. **QMedSync identifies the appropriate medical department** (e.g., Chest pain → Cardiology)
3. **A suitable doctor is found** for that department
4. **A suitable room is found** with the required equipment
5. **An available time slot is assigned** based on priority
6. **The patient receives their appointment** with full details

The patient does not interact with the quantum optimization details. The quantum/classical optimization is represented as a backend optimization concept designed for future integration.

## Features

### Patient Portal
- **Find My Appointment** — Enter name, age, gender, problem, and priority. QMedSync identifies the department, assigns a doctor, room, and time slot with a loading animation.
- **Appointment Result** — Clean appointment card with patient, department, doctor, room, floor, time, priority, and status. Includes "View Room", "View Appointment", and "Start Navigation" buttons.
- **Indoor Navigation** — Step-by-step directions from Reception to any room/department using a predefined 3-floor hospital layout. Visual floor maps included.
- **Voice Assistant** — Browser Web Speech API integration. Ask "Where is my appointment?", "Where is Cardiology?", "Where is Room 12?", etc. Includes text fallback when speech recognition is unavailable.
- **Profile** — View personal details and current appointment.

### Staff / Admin Portal
- **Dashboard** — Total patients, available doctors, available rooms, emergency cases, today's appointments. Quick actions and recent patients table.
- **Patients** — Full CRUD: view, add, edit, delete, search, and filter by priority. Uses localStorage.
- **Doctors** — Doctor cards with specialty, availability, current appointments, available time slots, and status.
- **Rooms** — Room cards with department, equipment, floor, availability, and current assignment.
- **Appointments** — Schedule timeline and table view of today's appointments.
- **Optimization** — Visual pipeline (Patient Data → Feasible Assignments → QUBO Formulation → Hybrid Optimization → Validation → Final Schedule). QUBO metrics, classical (Simulated Annealing) and quantum (QAOA Proof-of-Concept) components. "Run Optimization" button with step-by-step progress animation.
- **Emergency Re-optimization** — Add an emergency patient, trigger re-optimization simulation, and view the updated schedule.
- **Analytics** — Recharts visualizations: priority distribution (pie chart), patients by department (bar chart), doctor utilization, room utilization.
- **Settings** — Account info, data management, and about section.

### Login
- Two roles: **Patient** and **Staff/Admin**
- Staff credentials: `admin@qmedsync.demo` / `demo123`
- Frontend-only demo authentication using localStorage
- Clearly labeled as "Demo Prototype — Authentication is simulated"

## Technology Stack

| Technology | Purpose |
|---|---|
| React | UI framework |
| Vite | Build tool and dev server |
| JavaScript | Application logic |
| Tailwind CSS | Styling |
| React Router | Client-side routing |
| Lucide React | Icons |
| Recharts | Analytics charts |
| localStorage | Demo data persistence |
| Web Speech API | Voice assistant (speech recognition + synthesis) |

## Prototype Architecture

```
src/
  components/        # Reusable UI components (Button, Card, Badge, Modal, etc.)
  pages/
    Login.jsx
    patient/         # Patient portal pages
    staff/           # Staff/admin portal pages
  data/
    hospitalData.js  # Synthetic patients, doctors, rooms, schedule, floor plan, navigation routes
  services/
    optimizationService.js  # Frontend simulation of optimization pipeline
    authService.js          # Demo authentication (localStorage)
    storageService.js       # localStorage wrapper
  layouts/
    PatientLayout.jsx       # Patient sidebar/topbar layout
    StaffLayout.jsx         # Staff sidebar layout
  utils/
    cn.js                   # className utility
    helpers.js              # Badge variant + date helpers
  App.tsx                   # Router and route definitions
  main.tsx                  # Entry point
```

### Data Flow

```
Patient enters problem
        ↓
hospitalData.js: getDepartmentForProblem()  →  Department identified
        ↓
hospitalData.js: getDoctorForDepartment()   →  Doctor found
        ↓
hospitalData.js: getRoomForDepartment()     →  Room found
        ↓
hospitalData.js: getSlotForDoctor()         →  Time slot assigned
        ↓
Appointment saved to localStorage and displayed
```

### Optimization Service

The `optimizationService.js` provides the following functions, structured for future backend replacement:

- `runOptimization(onProgress)` — Simulates the full optimization pipeline
- `getOptimizationStatus()` — Returns current optimization status
- `getQuboData()` — Returns QUBO metadata (variables, terms, patients, doctors, rooms)
- `runQuantumDemo(onProgress)` — Simulates QAOA proof-of-concept
- `validateSchedule(schedule)` — Validates the schedule
- `emergencyReoptimization(patient, onProgress)` — Simulates emergency re-optimization

**Important:** QAOA is labeled as "Quantum Proof-of-Concept." No quantum advantage, quantum supremacy, faster-than-classical claims, or production quantum optimization is claimed. The optimization is simulated in the frontend.

## How to Run

```bash
# Install dependencies
npm install

# Start the development server
npm run dev

# Build for production
npm run build

# Preview the production build
npm run preview
```

## Future Backend Integration

The current version is a **frontend prototype** using synthetic hospital data. The optimization service is simulated in the frontend and is designed for future integration with the QMedSync Python optimization backend.

The service function signatures are designed so that each function can be replaced with an API call to a Python/FastAPI backend without redesigning the frontend:

```javascript
// Current (frontend simulation)
const result = await runOptimization(onProgress);

// Future (real backend)
const result = await fetch('/api/optimize', { method: 'POST', body: ... }).then(r => r.json());
```

The backend will provide:
- Real QUBO formulation and solving
- Classical simulated annealing
- QAOA quantum optimization (proof-of-concept → production)
- Real patient/doctor/room data management
- Authentication and authorization
- Persistent storage
