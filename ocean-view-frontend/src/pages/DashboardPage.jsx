import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { reservationApi, roomApi } from '../services/api'
import { useAuth } from '../context/AuthContext'
import {
  CalendarCheck, BedDouble, Users, TrendingUp,
  CalendarPlus, ArrowRight, Clock
} from 'lucide-react'

const STATUS_COLORS = {
  CONFIRMED: 'bg-blue-100 text-blue-700',
  CHECKED_IN: 'bg-green-100 text-green-700',
  CHECKED_OUT: 'bg-gray-100 text-gray-600',
  CANCELLED: 'bg-red-100 text-red-700',
}

export default function DashboardPage() {
  const { user, isAdmin } = useAuth()
  const [stats, setStats] = useState({ total: 0, confirmed: 0, checkedIn: 0, rooms: 0 })
  const [recent, setRecent] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all([reservationApi.getAll(), roomApi.getAll()])
      .then(([resRes, roomRes]) => {
        const reservations = resRes.data
        const rooms = roomRes.data
        setStats({
          total: reservations.length,
          confirmed: reservations.filter(r => r.status === 'CONFIRMED').length,
          checkedIn: reservations.filter(r => r.status === 'CHECKED_IN').length,
          rooms: rooms.filter(r => r.available).length,
        })
        setRecent(reservations.slice(-5).reverse())
      })
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  return (
    <div>
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-800">
          Welcome back, {user?.username} 👋
        </h2>
        <p className="text-gray-500 mt-1">Here's what's happening at Ocean View Resort today.</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
        {[
          { label: 'Total Reservations', value: stats.total, icon: CalendarCheck, color: 'bg-blue-500', light: 'bg-blue-50' },
          { label: 'Confirmed', value: stats.confirmed, icon: Clock, color: 'bg-indigo-500', light: 'bg-indigo-50' },
          { label: 'Checked In', value: stats.checkedIn, icon: Users, color: 'bg-green-500', light: 'bg-green-50' },
          { label: 'Available Rooms', value: stats.rooms, icon: BedDouble, color: 'bg-orange-500', light: 'bg-orange-50' },
        ].map(({ label, value, icon: Icon, color, light }) => (
          <div key={label} className="stat-card">
            <div className={`${light} p-3 rounded-xl`}>
              <Icon className={`w-6 h-6 ${color.replace('bg-', 'text-')}`} />
            </div>
            <div>
              <p className="text-gray-500 text-sm">{label}</p>
              <p className="text-2xl font-bold text-gray-800">
                {loading ? '...' : value}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Quick actions + recent */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Quick actions */}
        <div className="card">
          <h3 className="font-semibold text-gray-700 mb-4">Quick Actions</h3>
          <div className="space-y-3">
            {[
              { to: '/reservations/new', icon: CalendarPlus, label: 'New Reservation', color: 'text-blue-600 bg-blue-50' },
              { to: '/guests', icon: Users, label: 'Manage Guests', color: 'text-green-600 bg-green-50' },
              { to: '/rooms', icon: BedDouble, label: 'View Rooms', color: 'text-orange-600 bg-orange-50' },
              { to: '/help', icon: TrendingUp, label: 'Help & Guide', color: 'text-purple-600 bg-purple-50' },
            ].map(({ to, icon: Icon, label, color }) => (
              <Link
                key={to}
                to={to}
                className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors group"
              >
                <div className={`p-2 rounded-lg ${color}`}>
                  <Icon className="w-4 h-4" />
                </div>
                <span className="text-sm font-medium text-gray-700">{label}</span>
                <ArrowRight className="w-4 h-4 text-gray-400 ml-auto group-hover:text-gray-600" />
              </Link>
            ))}
          </div>
        </div>

        {/* Recent reservations */}
        <div className="card lg:col-span-2">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-gray-700">Recent Reservations</h3>
            <Link to="/reservations" className="text-sm text-blue-600 hover:underline">View all</Link>
          </div>
          {loading ? (
            <p className="text-gray-400 text-sm">Loading...</p>
          ) : recent.length === 0 ? (
            <p className="text-gray-400 text-sm text-center py-8">No reservations yet. <Link to="/reservations/new" className="text-blue-600 underline">Create one</Link></p>
          ) : (
            <div className="space-y-3">
              {recent.map(r => (
                <div key={r.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div>
                    <p className="text-sm font-medium text-gray-800">{r.reservationNumber}</p>
                    <p className="text-xs text-gray-500">{r.guest?.fullName || '—'}</p>
                  </div>
                  <div className="text-right">
                    <span className={`text-xs px-2 py-1 rounded-full font-medium ${STATUS_COLORS[r.status] || 'bg-gray-100 text-gray-600'}`}>
                      {r.status}
                    </span>
                    <p className="text-xs text-gray-500 mt-1">LKR {r.totalAmount?.toLocaleString()}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
