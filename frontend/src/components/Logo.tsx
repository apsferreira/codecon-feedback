interface LogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl'
}

const sizes = {
  sm: 'text-xl',
  md: 'text-2xl',
  lg: 'text-4xl',
  xl: 'text-6xl',
}

export default function Logo({ size = 'md' }: LogoProps) {
  return (
    <span className={`font-bold tracking-tight ${sizes[size]}`}>
      <span className="text-white">Vote</span>
      <span className="text-violet-400"> aí</span>
    </span>
  )
}
