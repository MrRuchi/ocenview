import { Outlet, NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import {
  LayoutDashboard, CalendarPlus, List, Users, BedDouble,
  BarChart3, HelpCircle, LogOut, Waves
} from 'lucide-react'
import toast from 'react-hot-toast'

// const navItems = [
//   { to: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
//   { to: '/reservations/new', icon: CalendarPlus, label: 'New Reservation' },
//   { to: '/reservations', icon: List, label: 'Reservations' },
//   { to: '/guests', icon: Users, label: 'Guests' },
//   { to: '/rooms', icon: BedDouble, label: 'Rooms' },
//   { to: '/reports', icon: BarChart3, label: 'Reports', adminOnly: true },
//   { to: '/help', icon: HelpCircle, label: 'Help' },
// ]

const navItems = [
  { to: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/reservations/new', icon: CalendarPlus, label: 'New Reservation', end: true },
  { to: '/reservations', icon: List, label: 'Reservations', end: true },
  { to: '/guests', icon: Users, label: 'Guests' },
  { to: '/rooms', icon: BedDouble, label: 'Rooms' },
  { to: '/reports', icon: BarChart3, label: 'Reports', adminOnly: true },
  { to: '/help', icon: HelpCircle, label: 'Help' },
]

export default function Layout() {
  const { user, logout, isAdmin } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    toast.success('Logged out successfully')
    navigate('/login')
  }

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <aside className="w-64 bg-[#1e3a5f] flex flex-col shadow-xl">
        {/* Logo */}
        <div className="p-6 border-b border-blue-800">
          <div className="flex items-center gap-3">
            <div className="bg-blue-400 p-2 rounded-lg">
              <Waves className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-white font-bold text-sm leading-tight">Ocean View</h1>
              <p className="text-blue-300 text-xs">Resort Management</p>
            </div>
          </div>
        </div>

        {/* Nav items */}
        <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
          {navItems.map(({ to, icon: Icon, label, adminOnly , end}) => {
            if (adminOnly && !isAdmin()) return null
            return (
              <NavLink
                key={to}
                to={to}
                end={end}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                    isActive
                      ? 'bg-blue-600 text-white'
                      : 'text-blue-200 hover:bg-blue-800 hover:text-white'
                  }`
                }
              >
                <Icon className="w-4 h-4 flex-shrink-0" />
                {label}
              </NavLink>
            )
          })}
        </nav>

        {/* User info + logout */}
        <div className="p-4 border-t border-blue-800">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center text-white text-sm font-bold">
              {user?.username?.[0]?.toUpperCase()}
            </div>
            <div>
              <p className="text-white text-sm font-medium">{user?.username}</p>
              <span className={`text-xs px-2 py-0.5 rounded-full ${
                isAdmin() ? 'bg-yellow-500 text-yellow-900' : 'bg-blue-500 text-white'
              }`}>
                {user?.role}
              </span>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 w-full px-3 py-2 text-blue-200 hover:text-white hover:bg-blue-800 rounded-lg text-sm transition-colors"
          >
            <LogOut className="w-4 h-4" />
            Sign Out
          </button>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 overflow-auto">
        <div className="p-8">
          <Outlet />
        </div>
      </main>
    </div>
  )
}
