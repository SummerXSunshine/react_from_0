import { useEffect, useState } from 'react'

/** 返回防抖后的值，value 停止变化 delay 毫秒后才会更新。 */
export function useDebounce<T>(value: T, delay = 300): T {
  const [debouncedValue, setDebouncedValue] = useState(value)

  useEffect(() => {
    const timer = window.setTimeout(
      () => setDebouncedValue(value),
      Math.max(0, delay),
    )

    return () => window.clearTimeout(timer)
  }, [value, delay])

  return debouncedValue
}
