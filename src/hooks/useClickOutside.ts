import { useEffect, useRef, type RefObject } from 'react'

/**
 * 监听目标元素外部的指针点击，常用于关闭弹窗、下拉菜单或浮层。
 */
export function useClickOutside<T extends HTMLElement>(
  onClickOutside: (event: PointerEvent) => void,
  enabled = true,
): RefObject<T | null> {
  const elementRef = useRef<T>(null)
  const handlerRef = useRef(onClickOutside)

  handlerRef.current = onClickOutside

  useEffect(() => {
    if (!enabled) return

    const handlePointerDown = (event: PointerEvent) => {
      const element = elementRef.current

      if (!element || event.composedPath().includes(element)) return
      handlerRef.current(event)
    }

    document.addEventListener('pointerdown', handlePointerDown, true)

    return () => {
      document.removeEventListener('pointerdown', handlePointerDown, true)
    }
  }, [enabled])

  return elementRef
}
