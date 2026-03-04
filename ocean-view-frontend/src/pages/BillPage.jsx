import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { reservationApi } from '../services/api'
import toast from 'react-hot-toast'
import { Printer, ArrowLeft, Waves } from 'lucide-react'

export default function BillPage() {
  const { number } = useParams()
  const navigate = useNavigate()
  const [bill, setBill] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    reservationApi.getBill(number)
      .then(r => setBill(r.data))
      .catch(() => { toast.error('Bill not found'); navigate('/reservations') })
      .finally(() => setLoading(false))
  }, [number])

  if (loading) return <p className="text-center text-gray-400 py-16">Loading bill...</p>
  if (!bill) return null

  return (
    <div className="max-w-2xl mx-auto">
      <div className="flex items-center justify-between mb-6 print:hidden">
        <button onClick={() => navigate('/reservations')} className="flex items-center gap-2 text-gray-600 hover:text-gray-800">
          <ArrowLeft className="w-4 h-4" /> Back
        </button>
        <button onClick={() => window.print()} className="btn-primary flex items-center gap-2">
          <Printer className="w-4 h-4" /> Print Bill
        </button>
      </div>

      {/* Bill document */}
      <div className="bg-white rounded-2xl shadow-lg p-8 print:shadow-none print:rounded-none">
        {/* Header */}
        <div className="flex items-center justify-between pb-6 border-b-2 border-blue-700 mb-6">
          <div className="flex items-center gap-3">
            <div className="bg-[#1e3a5f] p-3 rounded-xl">
              <Waves className="w-7 h-7 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-[#1e3a5f]">Ocean View Resort</h1>
              <p className="text-gray-500 text-sm">Galle, Sri Lanka</p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-sm text-gray-500">Invoice</p>
            <p className="font-bold text-blue-700 font-mono text-lg">{bill.reservationNumber}</p>
            <p className="text-xs text-gray-400">{new Date(bill.generatedAt).toLocaleDateString()}</p>
          </div>
        </div>

        {/* Guest & Room Info */}
        <div className="grid grid-cols-2 gap-6 mb-6">
          <div>
            <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Guest Details</h3>
            <p className="font-semibold text-gray-800">{bill.guestName}</p>
            <p className="text-sm text-gray-600">{bill.guestEmail}</p>
            <p className="text-sm text-gray-600">{bill.guestContact}</p>
            <p className="text-sm text-gray-600">{bill.guestAddress}</p>
          </div>
          <div>
            <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Room Details</h3>
            <p className="font-semibold text-gray-800">{bill.roomNumber} — {bill.roomType}</p>
            <p className="text-sm text-gray-600">{bill.amenities}</p>
          </div>
        </div>

        {/* Stay Period */}
        <div className="bg-gray-50 rounded-xl p-4 mb-6">
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <p className="text-xs text-gray-500 mb-1">Check-In</p>
              <p className="font-semibold text-gray-800">{bill.checkInDate}</p>
            </div>
            <div>
              <p className="text-xs text-gray-500 mb-1">Check-Out</p>
              <p className="font-semibold text-gray-800">{bill.checkOutDate}</p>
            </div>
            <div>
              <p className="text-xs text-gray-500 mb-1">Duration</p>
              <p className="font-semibold text-gray-800">{bill.numberOfNights} nights</p>
            </div>
          </div>
        </div>

        {/* Billing breakdown */}
        <table className="w-full mb-6">
          <thead>
            <tr className="bg-[#1e3a5f] text-white text-sm">
              <th className="px-4 py-3 text-left rounded-tl-lg">Description</th>
              <th className="px-4 py-3 text-center">Nights</th>
              <th className="px-4 py-3 text-right">Rate/Night</th>
              <th className="px-4 py-3 text-right rounded-tr-lg">Amount</th>
            </tr>
          </thead>
          <tbody>
            <tr className="border-b border-gray-100">
              <td className="px-4 py-3 text-gray-700">{bill.roomType} — Room {bill.roomNumber}</td>
              <td className="px-4 py-3 text-center text-gray-600">{bill.numberOfNights}</td>
              <td className="px-4 py-3 text-right text-gray-600">LKR {bill.nightlyRate?.toLocaleString()}</td>
              <td className="px-4 py-3 text-right font-medium">LKR {bill.totalAmount?.toLocaleString()}</td>
            </tr>
          </tbody>
          <tfoot>
            <tr className="bg-blue-50">
              <td colSpan={3} className="px-4 py-4 text-right font-bold text-blue-800 text-lg">Total Amount:</td>
              <td className="px-4 py-4 text-right font-bold text-blue-800 text-xl">LKR {bill.totalAmount?.toLocaleString()}</td>
            </tr>
          </tfoot>
        </table>

        {/* Status */}
        <div className="flex items-center justify-between text-sm text-gray-500 border-t pt-4">
          <p>Status: <span className="font-semibold text-gray-700">{bill.status}</span></p>
          <p>Thank you for choosing Ocean View Resort</p>
        </div>
      </div>
    </div>
  )
}
