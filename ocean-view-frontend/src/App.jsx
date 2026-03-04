import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import { AuthProvider, useAuth } from './context/AuthContext'
import LoginPage from './pages/LoginPage'
import DashboardPage from './pages/DashboardPage'
import ReservationsPage from './pages/ReservationsPage'
import NewReservationPage from './pages/NewReservationPage'
import GuestsPage from './pages/GuestsPage'
import RoomsPage from './pages/RoomsPage'
import BillPage from './pages/BillPage'
import ReportsPage from './pages/ReportsPage'
import HelpPage from './pages/HelpPage'
import Layout from './components/Layout'

function ProtectedRoute({ children, adminOnly = false }) {
  const { user, loading } = useAuth()
  if (loading) return <div className="flex items-center justify-center h-screen">Loading...</div>
  if (!user) return <Navigate to="/login" replace />
  if (adminOnly && user.role !== 'ADMIN') return <Navigate to="/dashboard" replace />
  return children
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Toaster position="top-right" toastOptions={{ duration: 3000 }} />
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/" element={<ProtectedRoute><Layout /></ProtectedRoute>}>
            <Route index element={<Navigate to="/dashboard" replace />} />
            <Route path="dashboard" element={<DashboardPage />} />
            <Route path="reservations" element={<ReservationsPage />} />
            <Route path="reservations/new" element={<NewReservationPage />} />
            <Route path="reservations/:number/bill" element={<BillPage />} />
            <Route path="guests" element={<GuestsPage />} />
            <Route path="rooms" element={<RoomsPage />} />
            <Route path="reports" element={
              <ProtectedRoute adminOnly><ReportsPage /></ProtectedRoute>
            } />
            <Route path="help" element={<HelpPage />} />
          </Route>
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  )
}
