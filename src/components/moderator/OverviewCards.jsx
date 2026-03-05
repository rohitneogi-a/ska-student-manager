import { Users, CircleUserRound } from 'lucide-react'

export default function OverviewCards({ totalStudents = 0 }) {
  const cards = [
    {
      id: 'total-users',
      value: totalStudents,
      label: 'Total Users',
      icon: Users,
      iconColor: 'text-teal-600',
      iconBg: 'bg-teal-100',
    },
    {
      id: 'active-students',
      value: totalStudents,
      label: 'Active Students',
      icon: CircleUserRound,
      iconColor: 'text-amber-600',
      iconBg: 'bg-amber-100',
    },
  ]

  return (
    <div className="grid grid-cols-2 gap-6">
      {cards.map(card => {
        const Icon = card.icon
        return (
          <div
            key={card.id}
            className="font-page-title bg-white p-6 rounded-xl shadow-md card-hover card-animate transform hover:shadow-lg"
          >
            <div className="flex justify-between items-start">
              <div>
                <div className="text-4xl font-bold text-slate-800">
                  {card.value}
                </div>
                <div className="text-slate-600 text-sm mt-1">
                  {card.label}
                </div>
              </div>
              <div className={`${card.iconBg} p-3 rounded-lg`}>
                <Icon className={`w-6 h-6 ${card.iconColor}`} />
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
}
