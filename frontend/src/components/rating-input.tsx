import { Star } from 'lucide-react'
import { cn } from '@/lib/utils'

interface RatingInputProps {
  value: number | null
  onChange: (value: number) => void
  disabled?: boolean
  error?: boolean
}

const RATINGS = [1, 2, 3, 4, 5] as const

export function RatingInput({ value, onChange, disabled, error }: RatingInputProps) {
  return (
    <div
      role="radiogroup"
      aria-label="Nota de 1 a 5"
      aria-required="true"
      aria-invalid={error ? 'true' : undefined}
      className="flex items-center gap-2"
    >
      {RATINGS.map((rating) => {
        const isSelected = value !== null && rating <= value
        return (
          <button
            key={rating}
            type="button"
            role="radio"
            aria-checked={value === rating}
            aria-label={`${rating} de 5 estrelas`}
            disabled={disabled}
            onClick={() => onChange(rating)}
            className={cn(
              'rounded-md p-1.5 transition-colors focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50 disabled:pointer-events-none disabled:opacity-50'
            )}
          >
            <Star
              className={cn(
                'size-8 transition-colors',
                isSelected
                  ? 'fill-primary text-primary'
                  : 'fill-transparent text-muted-foreground'
              )}
              aria-hidden="true"
            />
          </button>
        )
      })}
    </div>
  )
}
