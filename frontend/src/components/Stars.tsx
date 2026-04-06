import { cn } from '@/lib/utils'

interface StarsProps {
  value: number
  max?: number
  size?: 'sm' | 'md' | 'lg'
  interactive?: boolean
  onChange?: (rating: number) => void
}

const sizes = {
  sm: 'text-base',
  md: 'text-2xl',
  lg: 'text-4xl',
}

export default function Stars({ value, max = 5, size = 'md', interactive = false, onChange }: StarsProps) {
  return (
    <div className={cn('flex gap-1', sizes[size])} aria-label={`Avaliação: ${value} de ${max} estrelas`}>
      {Array.from({ length: max }, (_, i) => {
        const star = i + 1
        const filled = star <= value
        return (
          <button
            key={star}
            type="button"
            disabled={!interactive}
            onClick={() => onChange?.(star)}
            className={cn(
              'leading-none transition-transform',
              interactive && 'cursor-pointer hover:scale-110 focus:outline-none',
              !interactive && 'cursor-default',
              filled ? 'text-amber-400' : 'text-gray-600',
            )}
            aria-label={`${star} estrela${star > 1 ? 's' : ''}`}
          >
            ★
          </button>
        )
      })}
    </div>
  )
}
