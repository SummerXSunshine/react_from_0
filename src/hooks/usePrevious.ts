import { useEffect, useRef } from 'react'

/** 返回上一次渲染提交后的值，首次返回 undefined。 */
export function usePrevious<T>(value: T): T | undefined {
  const previousRef = useRef<T | undefined>(undefined)

  useEffect(() => {
    previousRef.current = value
  }, [value])

  return previousRef.current
}
