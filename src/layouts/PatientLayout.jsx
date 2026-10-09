import { NavLink, useNavigate } from 'react-router-dom';
import {
  Home,
  CalendarCheck,
  MapPin,
  Mic,
  User,
  LogOut,
  Activity,
} from 'lucide-react';
import { cn } from '@/utils/cn';
import { logout } from '@/services/authService';

const navItems = [
  { to: '/patient/home', label: 'Home', icon: Home },
  { to: '/patient/appointment', label: 'My Appointment', icon: CalendarCheck },
  { to: '/patient/find-room', label: 'Find My Room', icon: MapPin },
  { to: '/patient/voice', label: 'Voice Assistant', icon: Mic },
  { to: '/patient/profile', label: 'Profile', icon: User },
];

export default function PatientLayout({ children }) {
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="flex min-h-screen bg-slate-50">
      {/* Desktop sidebar */}
      <aside className="fixed inset-y-0 left-0 z-30 hidden w-60 border-r border-slate-200 bg-white lg:flex lg:flex-col">
        <div className="flex items-center gap-2 border-b border-slate-200 px-5 py-4">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-teal-600">
            <Activity className="text-white" size={18} />
          </div>
          <div>
            <p className="text-sm font-bold text-slate-800">QMedSync</p>
            <p className="text-[10px] text-slate-400">Patient Portal</p>
          </div>
        </div>
        <nav className="flex-1 space-y-1 px-3 py-4">
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
          onClick={handleLogout}
          className="rounded-lg p-1.5 text-slate-500 hover:bg-slate-100"
        >
          <LogOut size={18} />
        </button>
      </div>

      {/* Main content */}
      <div className="flex-1 lg:pl-60">
        {/* Mobile bottom nav */}
        <nav className="fixed inset-x-0 bottom-0 z-30 flex items-center justify-around border-t border-slate-200 bg-white px-2 py-2 lg:hidden">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                cn(
                  'flex flex-col items-center gap-1 rounded-lg px-2 py-1 text-[10px] font-medium transition-colors',
                  isActive ? 'text-teal-700' : 'text-slate-500'
                )
              }
            >
              <item.icon size={18} />
              {item.label.split(' ')[0]}
            </NavLink>
          ))}
        </nav>
        <main className="min-h-screen px-4 pb-20 pt-16 lg:px-8 lg:pb-8 lg:pt-8">
          {children}
        </main>
      </div>
    </div>
  );
}
