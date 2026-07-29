import { Star } from 'lucide-react'
import { cn } from '@/lib/utils'

interface RatingDisplayProps {
  rating: number
  className?: string
}

export function RatingDisplay({ rating, className }: RatingDisplayProps) {
  return (
    <div
      className={cn('flex items-center gap-0.5', className)}
      role="img"
      aria-label={`Nota ${rating} de 5`}
    >
      {[1, 2, 3, 4, 5].map((star) => (
        <Star
          key={star}
          className={cn(
            'size-4',
            star <= rating ? 'fill-primary text-primary' : 'fill-transparent text-muted-foreground'
          )}
          aria-hidden="true"
        />
      ))}
    </div>
  )
}
