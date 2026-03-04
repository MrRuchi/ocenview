import { useState, useEffect } from 'react'
import { roomApi } from '../services/api'
import { useAuth } from '../context/AuthContext'
import toast from 'react-hot-toast'
import { BedDouble, Plus, X } from 'lucide-react'

const TYPE_COLORS = {
  STANDARD: 'bg-gray-100 text-gray-700',
  DELUXE: 'bg-blue-100 text-blue-700',
  SUITE: 'bg-purple-100 text-purple-700',
  BEACHFRONT_VILLA: 'bg-orange-100 text-orange-700',
}

export default function RoomsPage() {
  const { isAdmin } = useAuth()
  const [rooms, setRooms] = useState([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState({ roomNumber:'', roomType:'STANDARD', floorNumber:1, useFactory:true })

  const load = () => {
    roomApi.getAll().then(r => setRooms(r.data)).catch(() => toast.error('Failed to load rooms'))
      .finally(() => setLoading(false))
  }
  useEffect(() => { load() }, [])

  const handleCreate = async (e) => {
    e.preventDefault()
    try {
      await roomApi.create(form)
      toast.success('Room created via RoomFactory!')
      setShowForm(false)
      load()
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to create room')
    }
  }

  const handleAvailability = async (id, available) => {
    try {
      await roomApi.setAvailability(id, available)
      toast.success(`Room marked as ${available ? 'available' : 'unavailable'}`)
      load()
    } catch { toast.error('Failed to update') }
  }

  const handleDelete = async (id) => {
    if (!confirm('Delete this room?')) return
    try {
      await roomApi.delete(id)
      toast.success('Room deleted')
      load()
    } catch { toast.error('Failed to delete') }
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
            <BedDouble className="w-6 h-6 text-blue-600" /> Rooms
          </h2>
          <p className="text-gray-500 text-sm mt-1">{rooms.length} rooms total — {rooms.filter(r=>r.available).length} available</p>
        </div>
        {isAdmin() && (
          <button className="btn-primary flex items-center gap-2" onClick={() => setShowForm(p=>!p)}>
            {showForm ? <X className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
            {showForm ? 'Cancel' : 'Add Room'}
          </button>
        )}
      </div>

      {showForm && isAdmin() && (
        <div className="card mb-6">
          <h3 className="font-semibold text-gray-700 mb-4">Add New Room (via RoomFactory)</h3>
          <form onSubmit={handleCreate} className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Room Number</label>
              <input className="input-field" placeholder="e.g. D205" value={form.roomNumber}
                onChange={e => setForm(p=>({...p,roomNumber:e.target.value}))} required />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Room Type</label>
              <select className="input-field" value={form.roomType} onChange={e => setForm(p=>({...p,roomType:e.target.value}))}>
                {['STANDARD','DELUXE','SUITE','BEACHFRONT_VILLA'].map(t => <option key={t}>{t}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Floor</label>
              <input type="number" className="input-field" value={form.floorNumber} min={1} max={10}
                onChange={e => setForm(p=>({...p,floorNumber:parseInt(e.target.value)}))} />
            </div>
            <div className="flex items-end">
              <button type="submit" className="btn-primary w-full">Create Room</button>
            </div>
          </form>
        </div>
      )}

      {loading ? <p className="text-center text-gray-400 py-12">Loading...</p> : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {rooms.map(r => (
            <div key={r.id} className={`card hover:shadow-md transition-shadow ${!r.available ? 'opacity-60' : ''}`}>
              <div className="flex items-start justify-between mb-3">
                <div>
                  <p className="font-bold text-gray-800 text-lg">{r.roomNumber}</p>
                  <span className={`text-xs px-2 py-1 rounded-full font-medium ${TYPE_COLORS[r.roomType]}`}>
                    {r.roomTypeDisplay}
                  </span>
                </div>
                <span className={`text-xs px-2 py-1 rounded-full ${r.available ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-600'}`}>
                  {r.available ? 'Available' : 'Unavailable'}
                </span>
              </div>
              <p className="text-sm text-gray-600 mb-1">Floor {r.floorNumber} · Capacity: {r.capacity} guests</p>
              <p className="text-sm font-bold text-blue-700 mb-2">LKR {r.nightlyRate?.toLocaleString()} / night</p>
              <p className="text-xs text-gray-400 mb-4 line-clamp-2">{r.amenities}</p>
              {isAdmin() && (
                <div className="flex gap-2">
                  <button onClick={() => handleAvailability(r.id, !r.available)}
                    className={`text-xs px-3 py-1.5 rounded-lg font-medium ${r.available ? 'bg-orange-100 text-orange-700 hover:bg-orange-200' : 'bg-green-100 text-green-700 hover:bg-green-200'}`}>
                    Mark {r.available ? 'Unavailable' : 'Available'}
                  </button>
                  <button onClick={() => handleDelete(r.id)}
                    className="text-xs px-3 py-1.5 rounded-lg font-medium bg-red-100 text-red-700 hover:bg-red-200">
                    Delete
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
