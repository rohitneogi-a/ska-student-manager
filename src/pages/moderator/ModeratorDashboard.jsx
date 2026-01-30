import { Check, Clock } from 'lucide-react'
import ModeratorLayout from '../../layouts/ModeratorLayout'
import OverviewCards from '../../components/moderator/OverviewCards'

export default function DashboardSection() {
  const recentActivity = [
    {
      name: 'Rajesh Kumar',
      action: 'Payment Received - December',
      date: 'Dec 22, 2025',
      status: 'Completed',
      statusType: 'completed',
    },
    {
      name: 'Priya Sharma',
      action: 'New Student Added',
      date: 'Dec 21, 2025',
      status: 'Active',
      statusType: 'completed',
    },
    {
      name: 'Amit Patel',
      action: 'Payment Pending - December',
      date: 'Dec 20, 2025',
      status: 'Pending',
      statusType: 'pending',
    },
    {
      name: 'Sneha Reddy',
      action: 'Payment Received - December',
      date: 'Dec 19, 2025',
      status: 'Completed',
      statusType: 'completed',
    },
  ]

  const getStatusStyle = (statusType) => {
    switch (statusType) {
      case 'completed':
        return 'bg-teal-50 text-teal-700'
      case 'pending':
        return 'bg-amber-50 text-amber-700'
      default:
        return 'bg-slate-100 text-slate-700'
    }
  }

  return (
    <ModeratorLayout>
      <div className='mt-4'>

      <OverviewCards/>
      </div>

    <div className="bg-white rounded-xl shadow-md p-7">
      <h2 className="text-2xl font-semibold text-slate-800 mb-6">
        Recent Activity
      </h2>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-200">
              <th className="px-4 py-3 text-left text-sm font-semibold text-slate-800">
                Student Name
              </th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-slate-800">
                Action
              </th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-slate-800">
                Date
              </th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-slate-800">
                Status
              </th>
            </tr>
          </thead>
          <tbody>
            {recentActivity.map((row, index) => (
              <tr
                key={index}
                className="border-b border-slate-100 hover:bg-slate-50 transition-colors"
              >
                <td className="px-4 py-3 text-sm text-slate-700">
                  {row.name}
                </td>
                <td className="px-4 py-3 text-sm text-slate-700">
                  {row.action}
                </td>
                <td className="px-4 py-3 text-sm text-slate-700">
                  {row.date}
                </td>
                <td className="px-4 py-3 text-sm">
                  <span
                    className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${getStatusStyle(
                      row.statusType
                    )}`}
                  >
                    {row.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
    </ModeratorLayout>
  )
}
