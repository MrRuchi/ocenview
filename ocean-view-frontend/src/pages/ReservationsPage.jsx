// ReservationsPage.jsx
import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { reservationApi } from '../services/api'
import { useAuth } from '../context/AuthContext'
import toast from 'react-hot-toast'
import { Search, Receipt, Pencil, Trash2, CalendarPlus } from 'lucide-react'

const STATUS_COLORS = {
  CONFIRMED: 'bg-blue-100 text-blue-700',
  CHECKED_IN: 'bg-green-100 text-green-700',
  CHECKED_OUT: 'bg-gray-100 text-gray-500',
  CANCELLED: 'bg-red-100 text-red-600',
}

export default function ReservationsPage() {
  const { isAdmin } = useAuth()
  const navigate = useNavigate()
  const [reservations, setReservations] = useState([])
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('')
  const [loading, setLoading] = useState(true)

  const load = () => {
    setLoading(true)
    reservationApi.getAll()
      .then(r => setReservations(r.data))
      .catch(() => toast.error('Failed to load reservations'))
      .finally(() => setLoading(false))
  }

  useEffect(() => { load() }, [])

  const handleStatusChange = async (num, status) => {
    try {
      await reservationApi.update(num, { status })
      toast.success('Status updated')
      load()
    } catch { toast.error('Update failed') }
  }

  const handleDelete = async (num) => {
    if (!confirm(`Delete reservation ${num}?`)) return
    try {
      await reservationApi.delete(num)
      toast.success('Reservation deleted')
      load()
    } catch { toast.error('Delete failed') }
  }

  const filtered = reservations.filter(r => {
    const matchSearch = search === '' ||
      r.reservationNumber?.toLowerCase().includes(search.toLowerCase()) ||
      r.guest?.fullName?.toLowerCase().includes(search.toLowerCase())
    const matchStatus = statusFilter === '' || r.status === statusFilter
    return matchSearch && matchStatus
  })

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Reservations</h2>
          <p className="text-gray-500 text-sm mt-1">{reservations.length} total reservations</p>
        </div>
        <Link to="/reservations/new" className="btn-primary flex items-center gap-2">
          <CalendarPlus className="w-4 h-4" /> New Reservation
        </Link>
      </div>

      <div className="card mb-6">
        <div className="flex gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input className="input-field pl-9" placeholder="Search by reservation number or guest name..."
              value={search} onChange={e => setSearch(e.target.value)} />
          </div>
          <select className="input-field w-48" value={statusFilter} onChange={e => setStatusFilter(e.target.value)}>
            <option value="">All Statuses</option>
            {['CONFIRMED','CHECKED_IN','CHECKED_OUT','CANCELLED'].map(s => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
        </div>
      </div>

      {loading ? (
        <p className="text-center text-gray-400 py-12">Loading...</p>
      ) : filtered.length === 0 ? (
        <div className="text-center py-16 card">
          <p className="text-gray-400 mb-2">No reservations found</p>
          <Link to="/reservations/new" className="text-blue-600 text-sm hover:underline">Create a reservation</Link>
        </div>
      ) : (
        <div className="card overflow-hidden p-0">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                {['Reservation #','Guest','Room','Check-In','Check-Out','Nights','Total','Status','Actions'].map(h => (
                  <th key={h} className="text-left px-4 py-3 font-medium text-gray-600 text-xs">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filtered.map(r => (
                <tr key={r.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-4 py-3 font-mono text-xs font-medium text-blue-600">{r.reservationNumber}</td>
                  <td className="px-4 py-3">
                    <p className="font-medium text-gray-800">{r.guest?.fullName}</p>
                    <p className="text-xs text-gray-400">{r.guest?.contactNumber}</p>
                  </td>
                  <td className="px-4 py-3">
                    <p className="font-medium">{r.room?.roomNumber}</p>
                    <p className="text-xs text-gray-400">{r.room?.roomTypeDisplay}</p>
                  </td>
                  <td className="px-4 py-3 text-gray-600">{r.checkInDate}</td>
                  <td className="px-4 py-3 text-gray-600">{r.checkOutDate}</td>
                  <td className="px-4 py-3 text-center text-gray-600">{r.numberOfNights}</td>
                  <td className="px-4 py-3 font-medium">LKR {r.totalAmount?.toLocaleString()}</td>
                  <td className="px-4 py-3">
                    <select
                      value={r.status}
                      onChange={e => handleStatusChange(r.reservationNumber, e.target.value)}
                      className={`text-xs px-2 py-1 rounded-full border-0 font-medium ${STATUS_COLORS[r.status]} cursor-pointer`}
                    >
                      {['CONFIRMED','CHECKED_IN','CHECKED_OUT','CANCELLED'].map(s => (
                        <option key={s} value={s}>{s}</option>
                      ))}
                    </select>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <Link to={`/reservations/${r.reservationNumber}/bill`}
                        className="p-1.5 text-green-600 hover:bg-green-50 rounded-lg" title="View Bill">
                        <Receipt className="w-4 h-4" />
                      </Link>
                      {isAdmin() && (
                        <button onClick={() => handleDelete(r.reservationNumber)}
                          className="p-1.5 text-red-500 hover:bg-red-50 rounded-lg" title="Delete">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
