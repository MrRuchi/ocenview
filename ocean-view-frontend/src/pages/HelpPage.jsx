import { HelpCircle, BookOpen, Users, BedDouble, Receipt, Shield, LogIn } from 'lucide-react'

const sections = [
  {
    icon: LogIn,
    title: 'Getting Started — Login',
    color: 'text-blue-600 bg-blue-50',
    items: [
      'Navigate to the system login page at the application URL.',
      'Enter your assigned username and password. Default: admin / Admin@123 or staff / Staff@123.',
      'After 3 failed login attempts, your account will be locked. Contact an administrator to unlock it.',
      'Your session is secured using JWT tokens. You will be automatically logged out on inactivity.',
    ]
  },
  {
    icon: BookOpen,
    title: 'Creating a New Reservation',
    color: 'text-green-600 bg-green-50',
    items: [
      'Click "New Reservation" in the sidebar or navigation menu.',
      'Search for an existing guest by name or email, or click "+ Add new guest" to register a new guest.',
      'Select an available room from the dropdown. Rooms are filtered to show only available ones.',
      'Set the check-in and check-out dates. The system will automatically calculate the total cost.',
      'Add any special requests (e.g., ocean view preference, late check-in).',
      'Click "Create Reservation" to confirm. A unique reservation number (OVR-YYYYMMDD-XXXX) will be generated.',
    ]
  },
  {
    icon: Users,
    title: 'Managing Guests',
    color: 'text-purple-600 bg-purple-50',
    items: [
      'Navigate to "Guests" to view all registered guests.',
      'Use the search bar to find guests by name or email.',
      'Click "Add Guest" to register a new guest. All fields are required and validated.',
      'Required guest fields: First name, last name, email (unique), contact number, address.',
      'Guest records are preserved across multiple reservations for history tracking.',
    ]
  },
  {
    icon: BedDouble,
    title: 'Room Management',
    color: 'text-orange-600 bg-orange-50',
    items: [
      'Navigate to "Rooms" to view all rooms and their availability status.',
      'Rooms are categorised into 4 types: Standard (LKR 8,000), Deluxe (LKR 12,000), Suite (LKR 18,000), Beachfront Villa (LKR 25,000).',
      'Admin users can add new rooms, toggle availability, and delete rooms.',
      'Marking a room as "Unavailable" prevents it from appearing in new reservation booking.',
    ]
  },
  {
    icon: Receipt,
    title: 'Viewing & Printing Bills',
    color: 'text-teal-600 bg-teal-50',
    items: [
      'Open the Reservations page and locate the desired reservation.',
      'Click the receipt icon (🧾) to open the bill for that reservation.',
      'The bill shows: guest details, room details, check-in/out dates, number of nights, nightly rate, and total amount.',
      'Click "Print Bill" to open the browser print dialog for a physical or PDF copy.',
    ]
  },
  {
    icon: Shield,
    title: 'Admin Functions',
    color: 'text-red-600 bg-red-50',
    items: [
      'Admin users have access to Reports (Occupancy & Revenue), room management, and user registration.',
      'To register a new staff or admin user, use POST /api/auth/register with Admin credentials (API-level).',
      'Deleting a reservation is an Admin-only action and is permanent.',
      'The Occupancy Report shows total reservations by status and total revenue from checked-out guests.',
    ]
  }
]

export default function HelpPage() {
  return (
    <div className="max-w-4xl">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
          <HelpCircle className="w-6 h-6 text-blue-600" /> Help & User Guide
        </h2>
        <p className="text-gray-500 mt-1">
          Ocean View Resort Reservation System — Staff Training Guide
        </p>
      </div>

      <div className="bg-blue-50 border border-blue-200 rounded-xl p-5 mb-6">
        <p className="text-blue-800 text-sm font-medium mb-1">Welcome to Ocean View Resort Reservation System</p>
        <p className="text-blue-600 text-sm">
          This system replaces manual reservation management with a computerised, role-based platform.
          All reservations, guest records, and billing operations are managed securely through this interface.
          If you encounter any issues, please contact your system administrator.
        </p>
      </div>

      <div className="space-y-4">
        {sections.map(({ icon: Icon, title, color, items }) => (
          <div key={title} className="card">
            <div className="flex items-center gap-3 mb-4">
              <div className={`p-2 rounded-lg ${color}`}>
                <Icon className="w-5 h-5" />
              </div>
              <h3 className="font-semibold text-gray-800">{title}</h3>
            </div>
            <ol className="space-y-2">
              {items.map((item, i) => (
                <li key={i} className="flex gap-3 text-sm text-gray-600">
                  <span className="text-blue-500 font-bold flex-shrink-0">{i + 1}.</span>
                  {item}
                </li>
              ))}
            </ol>
          </div>
        ))}
      </div>

      <div className="card mt-6 bg-gray-50">
        <h3 className="font-semibold text-gray-700 mb-3">Room Type Pricing Reference</h3>
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-gray-100">
              <th className="text-left px-3 py-2 rounded-tl-lg">Room Type</th>
              <th className="text-left px-3 py-2">Capacity</th>
              <th className="text-right px-3 py-2 rounded-tr-lg">Nightly Rate</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {[
              ['Standard Room','2 guests','LKR 8,000'],
              ['Deluxe Room','3 guests','LKR 12,000'],
              ['Suite','4 guests','LKR 18,000'],
              ['Beachfront Villa','6 guests','LKR 25,000'],
            ].map(([type, cap, rate]) => (
              <tr key={type} className="hover:bg-gray-50">
                <td className="px-3 py-2 font-medium text-gray-800">{type}</td>
                <td className="px-3 py-2 text-gray-600">{cap}</td>
                <td className="px-3 py-2 text-right font-semibold text-blue-700">{rate}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
