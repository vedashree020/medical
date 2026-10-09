import { useState, useMemo, useEffect } from 'react';
import {
  Users,
  Search,
  Plus,
  Pencil,
  Eye,
  Trash2,
  X,
} from 'lucide-react';
import StaffLayout from '@/layouts/StaffLayout';
import PageHeader from '@/components/PageHeader';
import Card from '@/components/Card';
import Badge from '@/components/Badge';
import Button from '@/components/Button';
import StatCard from '@/components/StatCard';
import Modal from '@/components/Modal';
import EmptyState from '@/components/EmptyState';
import { Input, Select } from '@/components/FormFields';
import { INITIAL_PATIENTS, PROBLEM_GROUPS, DOCTORS, ROOMS, getDepartmentForProblem, getDoctorForDepartment, getRoomForDepartment, getSlotForDoctor } from '@/data/hospitalData';
import { loadData, saveData } from '@/services/storageService';
import { priorityVariant, statusVariant } from '@/utils/helpers';

const emptyForm = {
  name: '',
  age: '',
  gender: '',
  problem: '',
  priority: 'Routine',
  department: '',
  doctor: '',
  room: '',
  time: '',
  status: 'Scheduled',
};

export default function StaffPatients() {
  const [patients, setPatients] = useState(() => loadData('patients', INITIAL_PATIENTS));
  const [search, setSearch] = useState('');
  const [filterPriority, setFilterPriority] = useState('all');
  const [modalOpen, setModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState('add'); // add | edit | view
  const [form, setForm] = useState(emptyForm);
  const [editId, setEditId] = useState(null);

  useEffect(() => {
    saveData('patients', patients);
  }, [patients]);

  const filtered = useMemo(() => {
    return patients.filter((p) => {
      const matchesSearch = p.name.toLowerCase().includes(search.toLowerCase()) ||
        p.department.toLowerCase().includes(search.toLowerCase()) ||
        (p.doctor && p.doctor.toLowerCase().includes(search.toLowerCase()));
      const matchesPriority = filterPriority === 'all' || p.priority === filterPriority;
      return matchesSearch && matchesPriority;
    });
  }, [patients, search, filterPriority]);

  const stats = useMemo(() => ({
    total: patients.length,
    emergency: patients.filter((p) => p.priority === 'Emergency').length,
    urgent: patients.filter((p) => p.priority === 'Urgent').length,
    routine: patients.filter((p) => p.priority === 'Routine').length,
  }), [patients]);

  const openAddModal = () => {
    setForm(emptyForm);
    setModalMode('add');
    setEditId(null);
    setModalOpen(true);
  };

  const openEditModal = (patient) => {
    setForm({ ...patient, age: String(patient.age) });
    setModalMode('edit');
    setEditId(patient.id);
    setModalOpen(true);
  };

  const openViewModal = (patient) => {
    setForm({ ...patient, age: String(patient.age) });
    setModalMode('view');
    setModalOpen(true);
  };

  const handleFormChange = (field, value) => {
    setForm((prev) => {
      const next = { ...prev, [field]: value };
      // Auto-assign department, doctor, room when problem changes
      if (field === 'problem') {
        const dept = getDepartmentForProblem(value);
        const doctor = getDoctorForDepartment(dept);
        const room = getRoomForDepartment(dept);
        const slot = getSlotForDoctor(doctor, next.priority);
        next.department = dept;
        next.doctor = doctor.name;
        next.room = room.name;
        next.time = slot;
      }
      if (field === 'priority' && next.problem) {
        const dept = getDepartmentForProblem(next.problem);
        const doctor = getDoctorForDepartment(dept);
        const slot = getSlotForDoctor(doctor, value);
        next.time = slot;
      }
      return next;
    });
  };

  const handleSave = () => {
    if (!form.name || !form.age || !form.problem) return;

    if (modalMode === 'add') {
      const newPatient = {
        ...form,
        id: 'pat-' + Date.now(),
        age: parseInt(form.age) || 0,
        date: new Date().toISOString().split('T')[0],
        floor: ROOMS.find((r) => r.name === form.room)?.floor || '',
      };
      setPatients((prev) => [...prev, newPatient]);
    } else if (modalMode === 'edit') {
      setPatients((prev) =>
        prev.map((p) =>
          p.id === editId
            ? { ...p, ...form, age: parseInt(form.age) || 0 }
            : p
        )
      );
    }
    setModalOpen(false);
  };

  const handleDelete = (id) => {
    setPatients((prev) => prev.filter((p) => p.id !== id));
  };

  return (
    <StaffLayout>
      <PageHeader
        title="Patients"
        subtitle="Manage patient records"
        icon={Users}
        action={
          <Button onClick={openAddModal}>
            <Plus size={16} />
            Add Patient
          </Button>
        }
      />

      {/* Stats */}
      <div className="mb-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard icon={Users} label="Total" value={stats.total} color="teal" />
        <StatCard icon={Plus} label="Emergency" value={stats.emergency} color="red" />
        <StatCard icon={Plus} label="Urgent" value={stats.urgent} color="amber" />
        <StatCard icon={Plus} label="Routine" value={stats.routine} color="sky" />
      </div>

      {/* Search and filter */}
      <Card className="mb-4 p-4">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <Input
              placeholder="Search by name, department, or doctor..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10"
            />
          </div>
          <Select
            value={filterPriority}
            onChange={(e) => setFilterPriority(e.target.value)}
            className="sm:w-48"
          >
            <option value="all">All Priorities</option>
            <option value="Emergency">Emergency</option>
            <option value="Urgent">Urgent</option>
            <option value="Routine">Routine</option>
          </Select>
        </div>
      </Card>

      {/* Patient table */}
      <Card className="overflow-hidden">
        {filtered.length === 0 ? (
          <EmptyState icon={Users} title="No patients found" message="Try adjusting your search or filter." />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-slate-50 text-left text-xs text-slate-400">
                <tr>
                  <th className="px-4 py-3 font-medium">Name</th>
                  <th className="px-4 py-3 font-medium">Age</th>
                  <th className="px-4 py-3 font-medium">Department</th>
                  <th className="px-4 py-3 font-medium">Doctor</th>
                  <th className="px-4 py-3 font-medium">Room</th>
                  <th className="px-4 py-3 font-medium">Time</th>
                  <th className="px-4 py-3 font-medium">Priority</th>
                  <th className="px-4 py-3 font-medium text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filtered.map((p) => (
                  <tr key={p.id} className="transition-colors hover:bg-slate-50">
                    <td className="px-4 py-3 font-medium text-slate-700">{p.name}</td>
                    <td className="px-4 py-3 text-slate-500">{p.age}</td>
                    <td className="px-4 py-3 text-slate-500">{p.department}</td>
                    <td className="px-4 py-3 text-slate-500">{p.doctor}</td>
                    <td className="px-4 py-3 text-slate-500">{p.room}</td>
                    <td className="px-4 py-3 text-slate-500">{p.time}</td>
                    <td className="px-4 py-3"><Badge variant={priorityVariant(p.priority)}>{p.priority}</Badge></td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          onClick={() => openViewModal(p)}
                          className="rounded-md p-1.5 text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-600"
                          title="View"
                        >
                          <Eye size={16} />
                        </button>
                        <button
                          onClick={() => openEditModal(p)}
                          className="rounded-md p-1.5 text-slate-400 transition-colors hover:bg-teal-50 hover:text-teal-600"
                          title="Edit"
                        >
                          <Pencil size={16} />
                        </button>
                        <button
                          onClick={() => handleDelete(p.id)}
                          className="rounded-md p-1.5 text-slate-400 transition-colors hover:bg-red-50 hover:text-red-600"
                          title="Delete"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>

      {/* Modal */}
      <Modal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title={
          modalMode === 'add' ? 'Add Patient' :
          modalMode === 'edit' ? 'Edit Patient' :
          'Patient Details'
        }
        footer={
          modalMode !== 'view' ? (
            <>
              <Button variant="secondary" onClick={() => setModalOpen(false)}>Cancel</Button>
              <Button onClick={handleSave}>Save</Button>
            </>
          ) : (
            <Button variant="secondary" onClick={() => setModalOpen(false)}>Close</Button>
          )
        }
      >
        <div className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <Input
              label="Name"
              value={form.name}
              onChange={(e) => handleFormChange('name', e.target.value)}
              disabled={modalMode === 'view'}
            />
            <Input
              label="Age"
              type="number"
              value={form.age}
              onChange={(e) => handleFormChange('age', e.target.value)}
              disabled={modalMode === 'view'}
            />
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <Select
              label="Gender"
              value={form.gender}
              onChange={(e) => handleFormChange('gender', e.target.value)}
              disabled={modalMode === 'view'}
            >
              <option value="">Select</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Other">Other</option>
            </Select>
            <Select
              label="Priority"
              value={form.priority}
              onChange={(e) => handleFormChange('priority', e.target.value)}
              disabled={modalMode === 'view'}
            >
              <option value="Routine">Routine</option>
              <option value="Urgent">Urgent</option>
              <option value="Emergency">Emergency</option>
            </Select>
          </div>
          <Select
            label="Problem / Symptoms"
            value={form.problem}
            onChange={(e) => handleFormChange('problem', e.target.value)}
            disabled={modalMode === 'view'}
          >
            <option value="">Select problem</option>
            {PROBLEM_GROUPS.map((group) => (
              <optgroup key={group.department} label={group.department}>
                {group.problems.map((p) => (
                  <option key={p} value={p}>{p}</option>
                ))}
              </optgroup>
            ))}
          </Select>
          {form.department && (
            <div className="rounded-lg bg-slate-50 px-4 py-3">
              <div className="grid gap-3 sm:grid-cols-2">
                <div>
                  <p className="text-xs text-slate-400">Department</p>
                  <p className="text-sm font-medium text-slate-700">{form.department}</p>
                </div>
                <div>
                  <p className="text-xs text-slate-400">Doctor</p>
                  <p className="text-sm font-medium text-slate-700">{form.doctor}</p>
                </div>
                <div>
                  <p className="text-xs text-slate-400">Room</p>
                  <p className="text-sm font-medium text-slate-700">{form.room}</p>
                </div>
                <div>
                  <p className="text-xs text-slate-400">Time</p>
                  <p className="text-sm font-medium text-slate-700">{form.time}</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </Modal>
    </StaffLayout>
  );
}
