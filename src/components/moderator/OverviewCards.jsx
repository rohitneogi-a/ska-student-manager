import { Users, BookOpen, Clock, DollarSign } from 'lucide-react'

export default function OverviewCards() {
  const cards = [
    {
      value: '248',
      label: 'Total Users',
      icon: Users,
      bgColor: 'bg-teal-50',
      iconColor: 'text-teal-600',
      iconBg: 'bg-teal-100',
    },
    {
      value: '186',
      label: 'Active Students',
      icon: BookOpen,
      bgColor: 'bg-amber-50',
      iconColor: 'text-amber-600',
      iconBg: 'bg-amber-100',
    },
  ]

  return (
    <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-2 gap-6 mb-8">
      {cards.map((card, index) => {
        const IconComponent = card.icon

        return (
          <div
            key={index}
            className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow hover:scale-105 duration-300"
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
                <IconComponent
                  className={`w-6 h-6 ${card.iconColor}`}
                />
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
}
