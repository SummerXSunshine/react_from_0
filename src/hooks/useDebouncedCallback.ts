import { useCallback, useEffect, useRef } from 'react'

export type DebouncedCallback<TArgs extends unknown[]> = {
  (...args: TArgs): void
  cancel: () => void
}

/** 返回防抖函数；连续调用时只执行最后一次调用。 */
export function useDebouncedCallback<TArgs extends unknown[]>(
  callback: (...args: TArgs) => void,
  delay = 300,
): DebouncedCallback<TArgs> {
  const callbackRef = useRef(callback)
  const timerRef = useRef<number | undefined>(undefined)
  callbackRef.current = callback

  const cancel = useCallback(() => {
    if (timerRef.current !== undefined) {
      window.clearTimeout(timerRef.current)
      timerRef.current = undefined
    }
  }, [])

  const debouncedCallback = useCallback(
    (...args: TArgs) => {
      cancel()
      timerRef.current = window.setTimeout(() => {
        callbackRef.current(...args)
        timerRef.current = undefined
      }, Math.max(0, delay))
    },
    [cancel, delay],
  ) as DebouncedCallback<TArgs>

  debouncedCallback.cancel = cancel
  useEffect(() => cancel, [cancel])

  return debouncedCallback
}
