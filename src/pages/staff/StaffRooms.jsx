import { useMemo } from 'react';
import { DoorOpen, Wrench, User, MapPin } from 'lucide-react';
import StaffLayout from '@/layouts/StaffLayout';
import PageHeader from '@/components/PageHeader';
import Card from '@/components/Card';
import Badge from '@/components/Badge';
import StatCard from '@/components/StatCard';
import { ROOMS, INITIAL_PATIENTS } from '@/data/hospitalData';
import { loadData, saveData } from '@/services/storageService';

export default function StaffRooms() {
  const patients = loadData('patients', INITIAL_PATIENTS);
  saveData('patients', patients);

  const roomData = useMemo(() => {
    return ROOMS.map((room) => {
      const assignment = patients.find((p) => p.room === room.name);
      return {
        ...room,
        currentAssignment: assignment || null,
        available: !assignment,
      };
    });
  }, [patients]);

  return (
    <StaffLayout>
      <PageHeader
        title="Rooms"
        subtitle="Room availability and current assignments"
        icon={DoorOpen}
      />

      <div className="mb-6 grid gap-4 sm:grid-cols-3">
        <StatCard icon={DoorOpen} label="Total Rooms" value={ROOMS.length} color="teal" />
        <StatCard icon={DoorOpen} label="Available" value={roomData.filter((r) => r.available).length} color="green" />
        <StatCard icon={User} label="Occupied" value={roomData.filter((r) => !r.available).length} color="amber" />
      </div>

      <div className="grid gap-5 lg:grid-cols-3">
        {roomData.map((room) => (
          <Card key={room.id} className="p-5">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-teal-50">
                  <DoorOpen className="text-teal-600" size={20} />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-800">{room.name}</h3>
                  <p className="text-xs text-slate-500">{room.department}</p>
                </div>
              </div>
              <Badge variant={room.available ? 'available' : 'urgent'}>
                {room.available ? 'Available' : 'Occupied'}
              </Badge>
            </div>

            <div className="mt-4 space-y-2 border-t border-slate-200 pt-4">
              <div className="flex items-center gap-2 text-sm">
                <MapPin size={15} className="text-slate-400" />
                <span className="text-slate-400">Floor:</span>
                <span className="font-medium text-slate-700">{room.floor}</span>
              </div>
              <div className="flex items-start gap-2 text-sm">
                <Wrench size={15} className="mt-0.5 text-slate-400" />
                <span className="text-slate-400">Equipment:</span>
                <div className="flex flex-wrap gap-1">
                  {room.equipment.map((eq) => (
                    <span key={eq} className="rounded-md bg-slate-100 px-2 py-0.5 text-xs font-medium text-slate-600">
                      {eq}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Current assignment */}
            <div className="mt-4 border-t border-slate-200 pt-4">
              <p className="mb-2 text-xs font-medium text-slate-400">Current Assignment</p>
              {room.currentAssignment ? (
                <div className="rounded-lg bg-slate-50 px-3 py-2.5">
                  <p className="text-sm font-medium text-slate-700">{room.currentAssignment.name}</p>
                  <p className="text-xs text-slate-400">
                    {room.currentAssignment.doctor} — {room.currentAssignment.time}
                  </p>
                  <div className="mt-1.5">
                    <Badge variant={room.currentAssignment.priority === 'Emergency' ? 'emergency' : room.currentAssignment.priority === 'Urgent' ? 'urgent' : 'routine'}>
                      {room.currentAssignment.priority}
                    </Badge>
                  </div>
                </div>
              ) : (
                <p className="text-xs text-slate-400">No current assignment — room is available.</p>
              )}
            </div>
          </Card>
        ))}
      </div>
    </StaffLayout>
  );
}
