import { useState, useEffect } from 'react'
import { adminApi } from '../services/api'
import toast from 'react-hot-toast'
import { BarChart3, RefreshCw } from 'lucide-react'

export default function ReportsPage() {
  const [report, setReport] = useState(null)
  const [loading, setLoading] = useState(true)

  const load = () => {
    setLoading(true)
    adminApi.getOccupancyReport()
      .then(r => setReport(r.data))
      .catch(() => toast.error('Failed to load report'))
      .finally(() => setLoading(false))
  }
  useEffect(() => { load() }, [])

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
            <BarChart3 className="w-6 h-6 text-blue-600" /> Occupancy Report
          </h2>
          <p className="text-gray-500 text-sm mt-1">Revenue and reservation statistics</p>
        </div>
        <button onClick={load} className="btn-secondary flex items-center gap-2">
          <RefreshCw className="w-4 h-4" /> Refresh
        </button>
      </div>

      {loading ? (
        <p className="text-center text-gray-400 py-16">Loading report...</p>
      ) : report && (
        <div className="space-y-6">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-5">
            {[
              { label: 'Total Reservations', value: report.totalReservations, color: 'text-blue-700 bg-blue-50' },
              { label: 'Confirmed', value: report.confirmedReservations, color: 'text-indigo-700 bg-indigo-50' },
              { label: 'Checked In', value: report.checkedInReservations, color: 'text-green-700 bg-green-50' },
              { label: 'Cancelled', value: report.cancelledReservations, color: 'text-red-700 bg-red-50' },
            ].map(({ label, value, color }) => (
              <div key={label} className="card text-center">
                <p className={`text-4xl font-bold ${color.split(' ')[0]} mb-1`}>{value}</p>
                <p className="text-sm text-gray-500">{label}</p>
              </div>
            ))}
          </div>

          <div className="card">
            <h3 className="font-semibold text-gray-700 mb-4">Revenue Summary</h3>
            <div className="flex items-center gap-4">
              <div>
                <p className="text-xs text-gray-500">Total Revenue (Checked Out)</p>
                <p className="text-3xl font-bold text-blue-700">LKR {report.totalRevenue?.toLocaleString()}</p>
              </div>
            </div>
          </div>

          <div className="card">
            <h3 className="font-semibold text-gray-700 mb-4">Status Breakdown</h3>
            {[
              { label: 'Confirmed', val: report.confirmedReservations, total: report.totalReservations, color: 'bg-blue-500' },
              { label: 'Checked In', val: report.checkedInReservations, total: report.totalReservations, color: 'bg-green-500' },
              { label: 'Checked Out', val: report.checkedOutReservations, total: report.totalReservations, color: 'bg-gray-400' },
              { label: 'Cancelled', val: report.cancelledReservations, total: report.totalReservations, color: 'bg-red-400' },
            ].map(({ label, val, total, color }) => (
              <div key={label} className="mb-3">
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-gray-600">{label}</span>
                  <span className="font-medium">{val}</span>
                </div>
                <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                  <div className={`h-full ${color} rounded-full transition-all`}
                    style={{ width: total > 0 ? `${(val/total)*100}%` : '0%' }} />
                </div>
              </div>
            ))}
          </div>

          <p className="text-xs text-gray-400 text-right">Generated: {report.generatedAt ? new Date(report.generatedAt).toLocaleString() : '—'}</p>
        </div>
      )}
    </div>
  )
}
