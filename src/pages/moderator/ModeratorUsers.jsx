import { useState } from 'react'
import { Eye, Edit, Ban, Plus } from 'lucide-react'
import ModeratorLayout from '../../layouts/ModeratorLayout'

export default function ModeratorUsers() {
  const [users] = useState([
    {
      id: '#001',
      name: 'Rajesh Kumar',
      email: 'rajesh.k@email.com',
      phone: '+91 98765 43210',
      status: 'Active',
    },
    {
      id: '#002',
      name: 'Priya Sharma',
      email: 'priya.s@email.com',
      phone: '+91 98765 43211',
      status: 'Active',
    },
    {
      id: '#003',
      name: 'Amit Patel',
      email: 'amit.p@email.com',
      phone: '+91 98765 43212',
      status: 'Pending',
    },
    {
      id: '#004',
      name: 'Sneha Reddy',
      email: 'sneha.r@email.com',
      phone: '+91 98765 43213',
      status: 'Active',
    },
  ])

  return (

    <ModeratorLayout>


    <div className="bg-white rounded-xl shadow-md p-7">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-semibold text-slate-800">
          Manage Users
        </h2>
        <button className="bg-teal-600 hover:bg-teal-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors">
          <Plus className="w-5 h-5" />
          Add New User
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-200">
              <th className="px-4 py-3 text-left text-sm font-semibold text-slate-800">
                ID
              </th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-slate-800">
                Name
              </th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-slate-800">
                Email
              </th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-slate-800">
                Phone
              </th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-slate-800">
                Status
              </th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-slate-800">
                Actions
              </th>
            </tr>
          </thead>

          <tbody>
            {users.map((user, index) => (
              <tr
                key={index}
                className="border-b border-slate-100 hover:bg-slate-50 transition-colors"
              >
                <td className="px-4 py-3 text-sm text-slate-700">
                  {user.id}
                </td>
                <td className="px-4 py-3 text-sm font-medium text-slate-800">
                  {user.name}
                </td>
                <td className="px-4 py-3 text-sm text-slate-600">
                  {user.email}
                </td>
                <td className="px-4 py-3 text-sm text-slate-600">
                  {user.phone}
                </td>
                <td className="px-4 py-3 text-sm">
                  <span
                    className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${
                      user.status === 'Active'
                        ? 'bg-teal-50 text-teal-700'
                        : 'bg-amber-50 text-amber-700'
                    }`}
                  >
                    {user.status}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <div className="flex gap-2">
                    <button className="bg-teal-50 hover:bg-teal-100 text-teal-700 p-2 rounded-lg transition-colors">
                      <Eye className="w-4 h-4" />
                    </button>
                    <button className="bg-amber-50 hover:bg-amber-100 text-amber-700 p-2 rounded-lg transition-colors">
                      <Edit className="w-4 h-4" />
                    </button>
                    <button className="bg-rose-50 hover:bg-rose-100 text-rose-700 p-2 rounded-lg transition-colors">
                      <Ban className="w-4 h-4" />
                    </button>
                  </div>
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
