import { useState } from 'react'
import { useClickOutside } from '../hooks'

export function ClickOutsidePage() {
  const [open, setOpen] = useState(false)
  const [insideClicks, setInsideClicks] = useState(0)
  const [outsideCloses, setOutsideCloses] = useState(0)
  const [message, setMessage] = useState('点击按钮打开弹窗')

  const dialogRef = useClickOutside<HTMLDivElement>(() => {
    setOpen(false)
    setOutsideCloses((count) => count + 1)
    setMessage('检测到外部点击，弹窗已关闭')
  }, open)

  const openDialog = () => {
    setOpen(true)
    setMessage('弹窗已打开，请测试内部与外部点击')
  }

  const handleInsideClick = () => {
    setInsideClicks((count) => count + 1)
    setMessage('点击发生在弹窗内部，弹窗保持打开')
  }

  return (
    <main className="page-shell test-page">
      <section className="card test-card">
        <p className="eyebrow">Hook Test</p>
        <h1>点击外部关闭弹窗</h1>
        <p className="subtitle">
          打开弹窗后，点击弹窗内部不会关闭；点击灰色遮罩会触发
          <code>useClickOutside</code>。
        </p>
        <div className="test-stats">
          <div><strong>{insideClicks}</strong><span>内部点击</span></div>
          <div><strong>{outsideCloses}</strong><span>外部关闭</span></div>
        </div>
        <p className="test-message" aria-live="polite">{message}</p>
        <button type="button" onClick={openDialog} disabled={open}>
          {open ? '弹窗已打开' : '打开测试弹窗'}
        </button>
      </section>

      {open && (
        <div className="dialog-backdrop">
          <div
            ref={dialogRef}
            className="dialog-panel"
            role="dialog"
            aria-modal="true"
            aria-labelledby="dialog-title"
          >
            <p className="eyebrow">Inside Area</p>
            <h2 id="dialog-title">这是弹窗内部</h2>
            <p>点击下面按钮，弹窗应该保持打开。</p>
            <button type="button" onClick={handleInsideClick}>
              测试内部点击
            </button>
            <p className="dialog-tip">点击弹窗外的灰色区域关闭</p>
          </div>
        </div>
      )}
    </main>
  )
}
