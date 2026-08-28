import { useCallback, useState } from 'react'

/** 管理布尔值，并提供切换与直接设置方法。 */
export function useToggle(
  initialValue = false,
): [boolean, () => void, (value: boolean) => void] {
  const [value, setValue] = useState(initialValue)
  const toggle = useCallback(() => setValue((current) => !current), [])

  return [value, toggle, setValue]
}
