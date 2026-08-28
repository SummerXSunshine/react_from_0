import { useState } from 'react'
import { useAppDispatch, useAppSelector } from '../app/hooks'
import {
  decrement,
  increment,
  incrementByAmount,
  reset,
} from '../features/counter/counterSlice'

export function CounterPage() {
  const count = useAppSelector((state) => state.counter.value)
  const dispatch = useAppDispatch()
  const [amount, setAmount] = useState(5)

  return (
    <main className="page-shell">
      <section className="card">
        <p className="eyebrow">Vite Starter</p>
        <h1>React + Redux + TypeScript</h1>
        <p className="subtitle">一个结构清晰、类型安全并可立即开发的前端项目。</p>
        <div className="counter" aria-live="polite">{count}</div>
        <div className="actions">
          <button type="button" onClick={() => dispatch(decrement())}>−1</button>
          <button type="button" onClick={() => dispatch(reset())}>重置</button>
          <button type="button" onClick={() => dispatch(increment())}>+1</button>
        </div>
        <div className="custom-action">
          <label htmlFor="amount">自定义增量</label>
          <input
            id="amount"
            type="number"
            value={amount}
            onChange={(event) => setAmount(Number(event.target.value))}
          />
          <button type="button" onClick={() => dispatch(incrementByAmount(amount))}>
            增加
          </button>
        </div>
      </section>
    </main>
  )
}
