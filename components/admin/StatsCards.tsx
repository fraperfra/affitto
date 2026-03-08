import type { Candidatura } from '@/lib/types'
import { Users, Clock, CheckCircle, XCircle } from 'lucide-react'

export function StatsCards({ candidature }: { candidature: Candidatura[] }) {
  const stats = [
    { label: 'Totale',    value: candidature.length,                                                 icon: Users,       color: 'text-blue-500' },
    { label: 'Nuove',     value: candidature.filter(c => c.stato_candidatura === 'nuova').length,     icon: Clock,       color: 'text-amber-500' },
    { label: 'Accettate', value: candidature.filter(c => c.stato_candidatura === 'accettata').length, icon: CheckCircle, color: 'text-green-500' },
    { label: 'Rifiutate', value: candidature.filter(c => c.stato_candidatura === 'rifiutata').length, icon: XCircle,     color: 'text-red-500' },
  ]

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
      {stats.map(({ label, value, icon: Icon, color }) => (
        <div key={label} className="bg-white rounded-xl border border-stone-100 p-5 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <p className="font-sans text-xs text-text-secondary uppercase tracking-wider">{label}</p>
            <Icon size={18} className={color} strokeWidth={1.5} />
          </div>
          <p className="font-serif text-3xl text-anthracite">{value}</p>
        </div>
      ))}
    </div>
  )
}
