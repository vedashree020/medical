import { useState, useMemo } from 'react';
import { MapPin, Navigation, ArrowDown, Building2, Search } from 'lucide-react';
import PatientLayout from '@/layouts/PatientLayout';
import Button from '@/components/Button';
import { Select } from '@/components/FormFields';
import Card from '@/components/Card';
import Badge from '@/components/Badge';
import { FLOOR_PLAN, NAVIGATION_ROUTES } from '@/data/hospitalData';
import { loadData } from '@/services/storageService';
import { cn } from '@/utils/cn';

export default function FindRoom() {
  const appointment = loadData('patientAppointment', null);
  const [destination, setDestination] = useState(appointment?.room || 'Cardiology Room');
  const [navStarted, setNavStarted] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);

  const allRooms = useMemo(() => {
    const rooms = [];
    FLOOR_PLAN.forEach((floor) => {
      floor.rooms.forEach((room) => {
        rooms.push({ ...room, floor: floor.floor });
      });
    });
    return rooms;
  }, []);

  const route = NAVIGATION_ROUTES[destination] || [];

  const handleStartNav = () => {
    setNavStarted(true);
    setCurrentStep(0);
  };

  const handleNextStep = () => {
    if (currentStep < route.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const destRoom = allRooms.find((r) => r.name === destination);
  const destFloor = destRoom?.floor || '';

  return (
    <PatientLayout>
      <div className="mx-auto max-w-3xl">
        <div className="mb-5">
          <h1 className="text-lg font-bold text-slate-800">Find My Room</h1>
          <p className="mt-0.5 text-sm text-slate-500">
            Get step-by-step indoor directions from Reception to your destination.
          </p>
        </div>

        {/* Destination selector */}
        <Card className="mb-5 p-5">
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-1.5 block text-sm font-medium text-slate-600">Current Location</label>
              <div className="flex items-center gap-2 rounded-lg border border-slate-300 bg-slate-50 px-3 py-2 text-sm text-slate-700">
                <MapPin size={16} className="text-teal-600" />
                Reception
              </div>
            </div>
            <Select label="Destination" value={destination} onChange={(e) => {
              setDestination(e.target.value);
              setNavStarted(false);
              setCurrentStep(0);
            }}>
              {allRooms.map((room) => (
                <option key={room.id} value={room.name}>
                  {room.name} ({room.floor})
                </option>
              ))}
            </Select>
          </div>

          {appointment && (
            <div className="mt-3 rounded-lg bg-teal-50 px-4 py-2.5">
              <p className="text-xs text-slate-600">
                Your appointment room: <span className="font-semibold text-teal-700">{appointment.room}</span>
                {' — '}{appointment.department} with {appointment.doctor} at {appointment.time}
              </p>
            </div>
          )}

          <div className="mt-4 flex gap-2">
            <Button onClick={handleStartNav} disabled={!route.length}>
              <Navigation size={16} />
              Start Navigation
            </Button>
            {navStarted && currentStep < route.length - 1 && (
              <Button variant="secondary" onClick={handleNextStep}>
                Next Step
              </Button>
            )}
          </div>
        </Card>

        {/* Route display */}
        {route.length > 0 && (
          <div className="grid gap-5 lg:grid-cols-2">
            {/* Step-by-step route */}
            <Card className="p-5">
              <h2 className="mb-4 flex items-center gap-2 text-sm font-bold text-slate-800">
                <Navigation size={16} className="text-teal-600" />
                Route Directions
              </h2>
              <div className="space-y-1">
                {route.map((step, i) => (
                  <div key={i} className="flex gap-3">
                    <div className="flex flex-col items-center">
                      <div
                        className={cn(
                          'flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs font-bold transition-colors',
                          i < currentStep
                            ? 'bg-teal-600 text-white'
                            : i === currentStep && navStarted
                            ? 'bg-teal-600 text-white ring-4 ring-teal-200'
                            : 'bg-slate-200 text-slate-500'
                        )}
                      >
                        {i < currentStep ? '✓' : i + 1}
                      </div>
                      {i < route.length - 1 && (
                        <div className={cn('h-8 w-0.5', i < currentStep ? 'bg-teal-400' : 'bg-slate-200')} />
                      )}
                    </div>
                    <div className={cn('pb-2', i === currentStep && navStarted && 'text-slate-800', i !== currentStep && !navStarted && 'text-slate-700')}>
                      <p className={cn('text-sm font-semibold', i === currentStep && navStarted ? 'text-teal-700' : 'text-slate-700')}>
                        {step.step}
                      </p>
                      <p className="text-xs text-slate-400">{step.detail}</p>
                    </div>
                  </div>
                ))}
              </div>
              {navStarted && currentStep >= route.length - 1 && (
                <div className="mt-4 rounded-lg bg-teal-50 px-4 py-3 text-center">
                  <p className="text-sm font-semibold text-teal-700">You have arrived at {destination}!</p>
                </div>
              )}
            </Card>

            {/* Floor map */}
            <Card className="p-5">
              <h2 className="mb-4 flex items-center gap-2 text-sm font-bold text-slate-800">
                <Building2 size={16} className="text-teal-600" />
                Floor Map
              </h2>
              <div className="space-y-4">
                {FLOOR_PLAN.map((floor) => {
                  const isDestFloor = floor.floor === destFloor;
                  return (
                    <div
                      key={floor.floor}
                      className={cn(
                        'rounded-lg border-2 p-3 transition-colors',
                        isDestFloor ? 'border-teal-400 bg-teal-50/50' : 'border-slate-200'
                      )}
                    >
                      <div className="mb-2 flex items-center justify-between">
                        <p className="text-xs font-bold text-slate-600">{floor.floor}</p>
                        {isDestFloor && <Badge variant="confirmed">Destination</Badge>}
                      </div>
                      <div className="grid grid-cols-3 gap-2">
                        {floor.rooms.map((room) => {
                          const isDest = room.name === destination || room.name === destRoom?.name;
                          return (
                            <div
                              key={room.id}
                              className={cn(
                                'rounded-md border px-2 py-1.5 text-center text-[10px] font-medium transition-colors',
                                isDest
                                  ? 'border-teal-500 bg-teal-100 text-teal-700'
                                  : 'border-slate-200 bg-white text-slate-500'
                              )}
                            >
                              {room.name}
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  );
                })}
              </div>
            </Card>
          </div>
        )}

        {!route.length && (
          <Card className="p-8 text-center">
            <Search className="mx-auto mb-3 text-slate-300" size={32} />
            <p className="text-sm text-slate-500">Select a destination to see directions.</p>
          </Card>
        )}
      </div>
    </PatientLayout>
  );
}
