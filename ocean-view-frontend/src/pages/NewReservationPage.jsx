import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { reservationApi, guestApi, roomApi } from '../services/api'
import toast from 'react-hot-toast'
import { CalendarPlus, Search } from 'lucide-react'

export default function NewReservationPage() {
  const navigate = useNavigate()
  const [guests, setGuests] = useState([])
  const [rooms, setRooms] = useState([])
  const [guestSearch, setGuestSearch] = useState('')
  const [form, setForm] = useState({
    guestId: '', roomId: '', checkInDate: '', checkOutDate: '', specialRequests: ''
  })
  const [errors, setErrors] = useState({})
  const [loading, setLoading] = useState(false)
  const [showNewGuest, setShowNewGuest] = useState(false)
  const [newGuest, setNewGuest] = useState({ firstName: '', lastName: '', email: '', contactNumber: '', address: '' })
  const [nights, setNights] = useState(0)
  const [selectedRoom, setSelectedRoom] = useState(null)

  useEffect(() => {
    Promise.all([guestApi.getAll(), roomApi.getAvailable()])
      .then(([g, r]) => { setGuests(g.data); setRooms(r.data) })
      .catch(() => toast.error('Failed to load data'))
  }, [])

  useEffect(() => {
    if (form.checkInDate && form.checkOutDate) {
      const diff = Math.round((new Date(form.checkOutDate) - new Date(form.checkInDate)) / 86400000)
      setNights(diff > 0 ? diff : 0)
    }
  }, [form.checkInDate, form.checkOutDate])

  useEffect(() => {
    if (form.roomId) setSelectedRoom(rooms.find(r => r.id === form.roomId) || null)
  }, [form.roomId, rooms])

  const filteredGuests = guests.filter(g =>
    guestSearch === '' || g.fullName.toLowerCase().includes(guestSearch.toLowerCase()) ||
    g.email.toLowerCase().includes(guestSearch.toLowerCase())
  )

  const validate = () => {
    const e = {}
    if (!form.guestId) e.guestId = 'Please select a guest'
    if (!form.roomId) e.roomId = 'Please select a room'
    if (!form.checkInDate) e.checkInDate = 'Check-in date required'
    if (!form.checkOutDate) e.checkOutDate = 'Check-out date required'
    if (form.checkInDate && form.checkOutDate && new Date(form.checkOutDate) <= new Date(form.checkInDate)) {
      e.checkOutDate = 'Check-out must be after check-in'
    }
    setErrors(e)
    return Object.keys(e).length === 0
  }

  const handleCreateGuest = async () => {
    try {
      const { data } = await guestApi.create(newGuest)
      setGuests(p => [...p, data])
      setForm(p => ({ ...p, guestId: data.id }))
      setShowNewGuest(false)
      setNewGuest({ firstName: '', lastName: '', email: '', contactNumber: '', address: '' })
      toast.success('Guest created!')
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to create guest')
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!validate()) return
    setLoading(true)
    try {
      const { data } = await reservationApi.create(form)
      toast.success(`Reservation ${data.reservationNumber} created!`)
      navigate('/reservations')
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to create reservation')
    } finally {
      setLoading(false)
    }
  }

  const today = new Date().toISOString().split('T')[0]

  return (
    <div className="max-w-4xl">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
          <CalendarPlus className="w-6 h-6 text-blue-600" /> New Reservation
        </h2>
        <p className="text-gray-500 text-sm mt-1">Create a new room reservation for a guest</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Guest Selection */}
        <div className="card">
          <h3 className="font-semibold text-gray-700 mb-4">Guest Information</h3>
          <div className="relative mb-3">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              className="input-field pl-9"
              placeholder="Search guest by name or email..."
              value={guestSearch}
              onChange={e => setGuestSearch(e.target.value)}
            />
          </div>
          <select
            className={`input-field ${errors.guestId ? 'border-red-400' : ''}`}
            value={form.guestId}
            onChange={e => setForm(p => ({ ...p, guestId: e.target.value }))}
          >
            <option value="">Select a guest</option>
            {filteredGuests.map(g => (
              <option key={g.id} value={g.id}>{g.fullName} — {g.email}</option>
            ))}
          </select>
          {errors.guestId && <p className="text-red-500 text-xs mt-1">{errors.guestId}</p>}
          <button type="button" className="text-sm text-blue-600 mt-2 hover:underline"
            onClick={() => setShowNewGuest(p => !p)}>
            + Add new guest
          </button>

          {showNewGuest && (
            <div className="mt-4 p-4 bg-gray-50 rounded-lg grid grid-cols-2 gap-3">
              {['firstName', 'lastName', 'email', 'contactNumber'].map(f => (
                <input key={f} className="input-field" placeholder={f.replace(/([A-Z])/g, ' $1').trim()}
                  value={newGuest[f]} onChange={e => setNewGuest(p => ({ ...p, [f]: e.target.value }))} />
              ))}
              <input className="input-field col-span-2" placeholder="Address"
                value={newGuest.address} onChange={e => setNewGuest(p => ({ ...p, address: e.target.value }))} />
              <button type="button" className="btn-primary col-span-2" onClick={handleCreateGuest}>
                Save Guest
              </button>
            </div>
          )}
        </div>

        {/* Room & Dates */}
        <div className="card">
          <h3 className="font-semibold text-gray-700 mb-4">Room & Dates</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Room</label>
              <select
                className={`input-field ${errors.roomId ? 'border-red-400' : ''}`}
                value={form.roomId}
                onChange={e => setForm(p => ({ ...p, roomId: e.target.value }))}
              >
                <option value="">Select a room</option>
                {rooms.map(r => (
                  <option key={r.id} value={r.id}>
                    {r.roomNumber} — {r.roomTypeDisplay} — LKR {r.nightlyRate?.toLocaleString()}/night
                  </option>
                ))}
              </select>
              {errors.roomId && <p className="text-red-500 text-xs mt-1">{errors.roomId}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Check-In Date</label>
              <input type="date" className={`input-field ${errors.checkInDate ? 'border-red-400' : ''}`}
                min={today} value={form.checkInDate}
                onChange={e => setForm(p => ({ ...p, checkInDate: e.target.value }))} />
              {errors.checkInDate && <p className="text-red-500 text-xs mt-1">{errors.checkInDate}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Check-Out Date</label>
              <input type="date" className={`input-field ${errors.checkOutDate ? 'border-red-400' : ''}`}
                min={form.checkInDate || today} value={form.checkOutDate}
                onChange={e => setForm(p => ({ ...p, checkOutDate: e.target.value }))} />
              {errors.checkOutDate && <p className="text-red-500 text-xs mt-1">{errors.checkOutDate}</p>}
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Special Requests</label>
              <textarea className="input-field" rows={3} placeholder="Any special requests or notes..."
                value={form.specialRequests}
                onChange={e => setForm(p => ({ ...p, specialRequests: e.target.value }))} />
            </div>
          </div>
        </div>

        {/* Summary */}
        {nights > 0 && selectedRoom && (
          <div className="card bg-blue-50 border-blue-200">
            <h3 className="font-semibold text-blue-800 mb-3">Booking Summary</h3>
            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <p className="text-2xl font-bold text-blue-700">{nights}</p>
                <p className="text-xs text-blue-600">Nights</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-blue-700">LKR {selectedRoom.nightlyRate?.toLocaleString()}</p>
                <p className="text-xs text-blue-600">Per Night</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-blue-700">LKR {(nights * selectedRoom.nightlyRate)?.toLocaleString()}</p>
                <p className="text-xs text-blue-600">Total</p>
              </div>
            </div>
          </div>
        )}

        <div className="flex gap-3">
          <button type="submit" disabled={loading} className="btn-primary px-8">
            {loading ? 'Creating...' : 'Create Reservation'}
          </button>
          <button type="button" className="btn-secondary" onClick={() => navigate('/reservations')}>
            Cancel
          </button>
        </div>
      </form>
    </div>
  )
}
