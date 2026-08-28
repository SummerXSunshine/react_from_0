import { useCallback, useEffect, useRef } from 'react'

export type ThrottledCallback<TArgs extends unknown[]> = {
  (...args: TArgs): void
  cancel: () => void
}

/** 返回节流函数；首次立即执行，等待期间保留最后一次调用。 */
export function useThrottledCallback<TArgs extends unknown[]>(
  callback: (...args: TArgs) => void,
  delay = 300,
): ThrottledCallback<TArgs> {
  const callbackRef = useRef(callback)
  const timerRef = useRef<number | undefined>(undefined)
  const lastCalledRef = useRef(0)
  const pendingArgsRef = useRef<TArgs | undefined>(undefined)
  callbackRef.current = callback

  const cancel = useCallback(() => {
    if (timerRef.current !== undefined) {
      window.clearTimeout(timerRef.current)
      timerRef.current = undefined
    }
    pendingArgsRef.current = undefined
  }, [])

  const throttledCallback = useCallback(
    (...args: TArgs) => {
      const normalizedDelay = Math.max(0, delay)
      const elapsed = Date.now() - lastCalledRef.current

      if (elapsed >= normalizedDelay) {
        cancel()
        lastCalledRef.current = Date.now()
        callbackRef.current(...args)
        return
      }

      pendingArgsRef.current = args
      if (timerRef.current === undefined) {
        timerRef.current = window.setTimeout(() => {
          const pendingArgs = pendingArgsRef.current
          timerRef.current = undefined
          pendingArgsRef.current = undefined

          if (pendingArgs) {
            lastCalledRef.current = Date.now()
            callbackRef.current(...pendingArgs)
          }
        }, normalizedDelay - elapsed)
      }
    },
    [cancel, delay],
  ) as ThrottledCallback<TArgs>

  throttledCallback.cancel = cancel
  useEffect(() => cancel, [cancel])

  return throttledCallback
}
