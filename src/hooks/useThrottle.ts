import { useEffect, useRef, useState } from 'react'

/** 返回节流后的值，在 delay 时间窗口内最多更新一次。 */
export function useThrottle<T>(value: T, delay = 300): T {
  const [throttledValue, setThrottledValue] = useState(value)
  const lastUpdatedRef = useRef(0)

  useEffect(() => {
    const normalizedDelay = Math.max(0, delay)
    const elapsed = Date.now() - lastUpdatedRef.current
    const remaining = Math.max(0, normalizedDelay - elapsed)
    const timer = window.setTimeout(() => {
      setThrottledValue(value)
      lastUpdatedRef.current = Date.now()
    }, remaining)

    return () => window.clearTimeout(timer)
  }, [value, delay])

  return throttledValue
}
