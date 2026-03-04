import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { authApi } from '../services/api'
import toast from 'react-hot-toast'
import { Waves, Eye, EyeOff } from 'lucide-react'

export default function LoginPage() {
  const [form, setForm] = useState({ username: '', password: '' })
  const [errors, setErrors] = useState({})
  const [loading, setLoading] = useState(false)
  const [showPass, setShowPass] = useState(false)
  const { login } = useAuth()
  const navigate = useNavigate()

  const validate = () => {
    const e = {}
    if (!form.username.trim()) e.username = 'Username is required'
    if (form.password.length < 6) e.password = 'Password must be at least 6 characters'
    setErrors(e)
    return Object.keys(e).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!validate()) return
    setLoading(true)
    try {
      const { data } = await authApi.login(form)
      login(data)
      toast.success(`Welcome back, ${data.username}!`)
      navigate('/dashboard')
    } catch (err) {
      const msg = err.response?.data?.message || 'Login failed. Please try again.'
      toast.error(msg)
      if (err.response?.status === 403) {
        setErrors({ general: 'Account locked. Contact an administrator.' })
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex">
      {/* Left panel */}
      <div className="hidden lg:flex w-1/2 bg-[#1e3a5f] flex-col justify-center items-center p-12 text-white">
        <div className="max-w-sm text-center">
          <div className="bg-blue-400 w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-6">
            <Waves className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-3xl font-bold mb-3">Ocean View Resort</h1>
          <p className="text-blue-200 text-lg mb-8">Galle, Sri Lanka</p>
          <p className="text-blue-300 text-sm leading-relaxed">
            Reservation Management System — streamlining guest bookings, room allocations, and billing operations for hotel staff.
          </p>
        </div>
      </div>

      {/* Right panel - Login form */}
      <div className="flex-1 flex items-center justify-center p-8 bg-gray-50">
        <div className="w-full max-w-md">
          <div className="bg-white rounded-2xl shadow-lg p-8">
            <div className="flex items-center gap-3 mb-8 lg:hidden">
              <Waves className="w-7 h-7 text-blue-700" />
              <h1 className="text-xl font-bold text-gray-800">Ocean View Resort</h1>
            </div>

            <h2 className="text-2xl font-bold text-gray-800 mb-2">Sign In</h2>
            <p className="text-gray-500 text-sm mb-8">Enter your credentials to access the system</p>

            {errors.general && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm mb-6">
                {errors.general}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Username</label>
                <input
                  className={`input-field ${errors.username ? 'border-red-400' : ''}`}
                  placeholder="Enter your username"
                  value={form.username}
                  onChange={e => setForm(p => ({ ...p, username: e.target.value }))}
                />
                {errors.username && <p className="text-red-500 text-xs mt-1">{errors.username}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                <div className="relative">
                  <input
                    type={showPass ? 'text' : 'password'}
                    className={`input-field pr-10 ${errors.password ? 'border-red-400' : ''}`}
                    placeholder="Enter your password"
                    value={form.password}
                    onChange={e => setForm(p => ({ ...p, password: e.target.value }))}
                  />
                  <button
                    type="button"
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    onClick={() => setShowPass(p => !p)}
                  >
                    {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password}</p>}
              </div>

              <button
                type="submit"
                disabled={loading}
                className="btn-primary w-full py-3 text-base"
              >
                {loading ? 'Signing in...' : 'Sign In'}
              </button>
            </form>

            <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-100">
              <p className="text-xs font-medium text-blue-700 mb-2">Default Credentials:</p>
              <p className="text-xs text-blue-600">Admin: <strong>admin</strong> / <strong>Admin@123</strong></p>
              <p className="text-xs text-blue-600">Staff: <strong>staff</strong> / <strong>Staff@123</strong></p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
