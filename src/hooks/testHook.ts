import { useEffect } from 'react'

export function useTestHook(value: string): void {
  useEffect(() => {
    if (!value) return

    console.log('title 改变：', value)
    // 在这里执行需要的逻辑
  }, [value])
}
