import { NavLink, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  Users,
  Stethoscope,
  DoorOpen,
  CalendarDays,
  Cpu,
  AlertTriangle,
  BarChart3,
  Settings,
  LogOut,
  Activity,
} from 'lucide-react';
import { useState } from 'react';
import { cn } from '@/utils/cn';
import { logout } from '@/services/authService';

const navItems = [
  { to: '/staff/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/staff/patients', label: 'Patients', icon: Users },
  { to: '/staff/doctors', label: 'Doctors', icon: Stethoscope },
  { to: '/staff/rooms', label: 'Rooms', icon: DoorOpen },
  { to: '/staff/appointments', label: 'Appointments', icon: CalendarDays },
  { to: '/staff/optimization', label: 'Optimization', icon: Cpu },
  { to: '/staff/emergency', label: 'Emergency Re-optimization', icon: AlertTriangle },
  { to: '/staff/analytics', label: 'Analytics', icon: BarChart3 },
  { to: '/staff/settings', label: 'Settings', icon: Settings },
];

export default function StaffLayout({ children }) {
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="flex min-h-screen bg-slate-50">
      {/* Desktop sidebar */}
      <aside className="fixed inset-y-0 left-0 z-30 hidden w-64 border-r border-slate-200 bg-white lg:flex lg:flex-col">
        <div className="flex items-center gap-2 border-b border-slate-200 px-5 py-4">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-teal-600">
            <Activity className="text-white" size={18} />
          </div>
          <div>
            <p className="text-sm font-bold text-slate-800">QMedSync</p>
            <p className="text-[10px] text-slate-400">Staff / Admin</p>
          </div>
        </div>
        <nav className="flex-1 space-y-1 overflow-y-auto scrollbar-thin px-3 py-4">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                cn(
                  'flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors',
                  isActive
                    ? 'bg-teal-50 text-teal-700'
                    : 'text-slate-600 hover:bg-slate-100'
                )
              }
            >
              <item.icon size={18} />
              {item.label}
            </NavLink>
          ))}
        </nav>
        <div className="border-t border-slate-200 p-3">
          <button
            onClick={handleLogout}
            className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-slate-600 transition-colors hover:bg-slate-100"
          >
            <LogOut size={18} />
            Logout
          </button>
        </div>
      </aside>

      {/* Mobile top bar */}
      <div className="fixed inset-x-0 top-0 z-30 flex items-center justify-between border-b border-slate-200 bg-white px-4 py-3 lg:hidden">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-teal-600">
            <Activity className="text-white" size={16} />
          </div>
          <p className="text-sm font-bold text-slate-800">QMedSync</p>
        </div>
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="rounded-lg p-1.5 text-slate-500 hover:bg-slate-100"
        >
          <LayoutDashboard size={18} />
        </button>
      </div>

      {/* Mobile drawer */}
      {mobileOpen && (
        <div className="fixed inset-0 z-40 lg:hidden">
          <div className="absolute inset-0 bg-slate-900/40" onClick={() => setMobileOpen(false)} />
          <div className="absolute left-0 top-0 h-full w-64 bg-white shadow-xl">
            <div className="flex items-center justify-between border-b border-slate-200 px-5 py-4">
              <p className="text-sm font-bold text-slate-800">Navigation</p>
              <button onClick={() => setMobileOpen(false)} className="text-slate-400">
                ✕
              </button>
            </div>
            <nav className="space-y-1 px-3 py-4">
              {navItems.map((item) => (
                <NavLink
                  key={item.to}
                  to={item.to}
                  onClick={() => setMobileOpen(false)}
                  className={({ isActive }) =>
                    cn(
                      'flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors',
                      isActive
                        ? 'bg-teal-50 text-teal-700'
                        : 'text-slate-600 hover:bg-slate-100'
                    )
                  }
                >
                  <item.icon size={18} />
                  {item.label}
                </NavLink>
              ))}
              <button
                onClick={handleLogout}
                className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-slate-600 transition-colors hover:bg-slate-100"
              >
                <LogOut size={18} />
                Logout
              </button>
            </nav>
          </div>
        </div>
      )}

      {/* Main content */}
      <div className="flex-1 lg:pl-64">
        <main className="min-h-screen px-4 pb-8 pt-16 lg:px-8 lg:pt-8">
          {children}
        </main>
      </div>
    </div>
  );
}
