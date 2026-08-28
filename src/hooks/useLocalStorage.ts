import { useCallback, useEffect, useRef, useState } from 'react'

type SetStoredValue<T> = (value: T | ((current: T) => T)) => void

function readLocalStorage<T>(key: string, initialValue: T): T {
  if (typeof window === 'undefined') return initialValue

  try {
    const value = window.localStorage.getItem(key)
    return value === null ? initialValue : (JSON.parse(value) as T)
  } catch {
    return initialValue
  }
}

/** 像 useState 一样使用 localStorage，并同步其他浏览器标签页。 */
export function useLocalStorage<T>(
  key: string,
  initialValue: T,
): [T, SetStoredValue<T>, () => void] {
  const initialValueRef = useRef(initialValue)
  initialValueRef.current = initialValue

  const [storedValue, setStoredValue] = useState<T>(() =>
    readLocalStorage(key, initialValueRef.current),
  )

  useEffect(() => {
    setStoredValue(readLocalStorage(key, initialValueRef.current))
  }, [key])

  useEffect(() => {
    const handleStorage = (event: StorageEvent) => {
      if (event.storageArea === window.localStorage && event.key === key) {
        setStoredValue(readLocalStorage(key, initialValueRef.current))
      }
    }

    window.addEventListener('storage', handleStorage)
    return () => window.removeEventListener('storage', handleStorage)
  }, [key])

  const setValue = useCallback<SetStoredValue<T>>(
    (value) => {
      setStoredValue((current) => {
        const nextValue = value instanceof Function ? value(current) : value
        try {
          window.localStorage.setItem(key, JSON.stringify(nextValue))
        } catch {
          // 禁止存储或空间不足时仍更新当前页面状态。
        }
        return nextValue
      })
    },
    [key],
  )

  const removeValue = useCallback(() => {
    try {
      window.localStorage.removeItem(key)
    } finally {
      setStoredValue(initialValueRef.current)
    }
  }, [key])

  return [storedValue, setValue, removeValue]
}
