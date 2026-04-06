interface DistributionBarProps {
  distribution: Record<string, number>
  total: number
}

export default function DistributionBar({ distribution, total }: DistributionBarProps) {
  return (
    <div className="space-y-1">
      {[5, 4, 3, 2, 1].map((star) => {
        const count = distribution[String(star)] ?? 0
        const pct = total > 0 ? Math.round((count / total) * 100) : 0
        return (
          <div key={star} className="flex items-center gap-2 text-xs">
            <span className="text-amber-400 w-3">{star}★</span>
            <div className="flex-1 bg-gray-700 rounded-full h-2 overflow-hidden">
              <div
                className="h-2 rounded-full bg-gradient-to-r from-violet-500 to-indigo-500 transition-all duration-500"
                style={{ width: `${pct}%` }}
              />
            </div>
            <span className="text-gray-400 w-7 text-right">{count}</span>
          </div>
        )
      })}
    </div>
  )
}
