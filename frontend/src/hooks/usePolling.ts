import { useEffect, useRef, useState } from 'react'

export function usePolling<T>(
  fn: () => Promise<T>,
  interval: number,
  deps: unknown[] = [],
): { data: T | null; error: Error | null; loading: boolean } {
  const [data, setData] = useState<T | null>(null)
  const [error, setError] = useState<Error | null>(null)
  const [loading, setLoading] = useState(true)
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null)

  useEffect(() => {
    let cancelled = false

    const run = async () => {
      try {
        const result = await fn()
        if (!cancelled) {
          setData(result)
          setError(null)
          setLoading(false)
        }
      } catch (e) {
        if (!cancelled) {
          setError(e instanceof Error ? e : new Error(String(e)))
          setLoading(false)
        }
      }
    }

    run()
    timerRef.current = setInterval(run, interval)

    return () => {
      cancelled = true
      if (timerRef.current) clearInterval(timerRef.current)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps)

  return { data, error, loading }
}
