import { useState, useEffect } from 'react'
import { guestApi } from '../services/api'
import { useAuth } from '../context/AuthContext'
import toast from 'react-hot-toast'
import { Users, Plus, Search, X, Trash2 } from 'lucide-react'

export default function GuestsPage() {
  const { isAdmin } = useAuth()
  const [guests, setGuests] = useState([])
  const [search, setSearch] = useState('')
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [deletingId, setDeletingId] = useState(null)
  const [form, setForm] = useState({
    firstName: '', lastName: '', email: '', contactNumber: '', address: ''
  })
  const [errors, setErrors] = useState({})

  const load = () => {
    guestApi.getAll()
      .then(r => setGuests(r.data))
      .catch(() => toast.error('Failed to load guests'))
      .finally(() => setLoading(false))
  }

  useEffect(() => { load() }, [])

  const validate = () => {
    const e = {}
    if (!form.firstName.trim()) e.firstName = 'Required'
    if (!form.lastName.trim()) e.lastName = 'Required'
    if (!form.email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) e.email = 'Invalid email'
    if (!form.contactNumber.match(/^[0-9+\-\s]{7,15}$/)) e.contactNumber = 'Invalid number'
    if (!form.address.trim()) e.address = 'Required'
    setErrors(e)
    return Object.keys(e).length === 0
  }

  const handleSave = async (e) => {
    e.preventDefault()
    if (!validate()) return
    try {
      await guestApi.create(form)
      toast.success('Guest registered successfully!')
      setShowForm(false)
      setForm({ firstName: '', lastName: '', email: '', contactNumber: '', address: '' })
      load()
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to save guest')
    }
  }

  const handleDelete = async (guest) => {
    const confirmed = window.confirm(
      `Are you sure you want to delete "${guest.fullName}"?\nThis action cannot be undone.`
    )
    if (!confirmed) return

    setDeletingId(guest.id)
    try {
      await guestApi.delete(guest.id)
      toast.success(`"${guest.fullName}" deleted successfully`)
      setGuests(prev => prev.filter(g => g.id !== guest.id))
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to delete guest')
    } finally {
      setDeletingId(null)
    }
  }

  const filtered = guests.filter(g =>
    search === '' ||
    g.fullName?.toLowerCase().includes(search.toLowerCase()) ||
    g.email?.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div>

      {/* ── Header ── */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
            <Users className="w-6 h-6 text-blue-600" /> Guests
          </h2>
          <p className="text-gray-500 text-sm mt-1">{guests.length} registered guests</p>
        </div>
        <button
          className="btn-primary flex items-center gap-2"
          onClick={() => setShowForm(p => !p)}
        >
          {showForm ? <X className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
          {showForm ? 'Cancel' : 'Add Guest'}
        </button>
      </div>

      {/* ── Add Guest Form ── */}
      {showForm && (
        <div className="card mb-6">
          <h3 className="font-semibold text-gray-700 mb-4">Register New Guest</h3>
          <form onSubmit={handleSave} className="grid grid-cols-2 gap-4">
            {[
              ['firstName', 'First Name'],
              ['lastName',  'Last Name'],
              ['email',     'Email'],
              ['contactNumber', 'Contact Number']
            ].map(([f, label]) => (
              <div key={f}>
                <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
                <input
                  className={`input-field ${errors[f] ? 'border-red-400' : ''}`}
                  placeholder={label}
                  value={form[f]}
                  onChange={e => setForm(p => ({ ...p, [f]: e.target.value }))}
                />
                {errors[f] && <p className="text-red-500 text-xs mt-1">{errors[f]}</p>}
              </div>
            ))}
            <div className="col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
              <input
                className={`input-field ${errors.address ? 'border-red-400' : ''}`}
                placeholder="Full address"
                value={form.address}
                onChange={e => setForm(p => ({ ...p, address: e.target.value }))}
              />
              {errors.address && <p className="text-red-500 text-xs mt-1">{errors.address}</p>}
            </div>
            <div className="col-span-2">
              <button type="submit" className="btn-primary">Register Guest</button>
            </div>
          </form>
        </div>
      )}

      {/* ── Search ── */}
      <div className="card mb-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            className="input-field pl-9"
            placeholder="Search by name or email..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>
      </div>

      {/* ── Admin notice ── */}
      {isAdmin() && (
        <div className="mb-4 px-4 py-3 bg-amber-50 border border-amber-200 rounded-lg text-sm text-amber-800 flex items-center gap-2">
          <Trash2 className="w-4 h-4 flex-shrink-0" />
          As Admin, you can delete guests using the Delete button on each row.
        </div>
      )}

      {/* ── Table ── */}
      {loading ? (
        <p className="text-center text-gray-400 py-12">Loading...</p>
      ) : (
        <div className="card overflow-hidden p-0">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b">
              <tr>
                {[
                  'Name', 'Email', 'Contact', 'Address', 'Registered',
                  ...(isAdmin() ? ['Action'] : [])
                ].map(h => (
                  <th key={h} className="text-left px-4 py-3 text-xs font-medium text-gray-600 uppercase tracking-wide">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filtered.map(g => (
                <tr key={g.id} className="hover:bg-gray-50 transition-colors">

                  <td className="px-4 py-3 font-medium text-gray-800">{g.fullName}</td>
                  <td className="px-4 py-3 text-gray-600">{g.email}</td>
                  <td className="px-4 py-3 text-gray-600">{g.contactNumber}</td>
                  <td className="px-4 py-3 text-gray-600">{g.address}</td>
                  <td className="px-4 py-3 text-gray-400 text-xs">
                    {g.createdAt ? new Date(g.createdAt).toLocaleDateString() : '—'}
                  </td>

                  {/* Delete button — only renders for Admin */}
                  {isAdmin() && (
                    <td className="px-4 py-3">
                      <button
                        onClick={() => handleDelete(g)}
                        disabled={deletingId === g.id}
                        className="flex items-center gap-1 px-3 py-1.5 text-xs font-medium text-red-600 border border-red-200 rounded-lg hover:bg-red-50 hover:border-red-400 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <Trash2 className="w-3 h-3" />
                        {deletingId === g.id ? 'Deleting...' : 'Delete'}
                      </button>
                    </td>
                  )}

                </tr>
              ))}
            </tbody>
          </table>

          {filtered.length === 0 && (
            <p className="text-center text-gray-400 py-8 text-sm">No guests found</p>
          )}
        </div>
      )}

    </div>
  )
}