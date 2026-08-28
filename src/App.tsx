import { NavLink, Navigate, Route, Routes } from 'react-router-dom'
import { ClickOutsidePage } from './pages/ClickOutsidePage'
import { CounterPage } from './pages/CounterPage'

function App() {
  return (
    <div className="app-shell">
      <header className="topbar">
        <span className="brand">React Lab</span>
        <nav aria-label="主导航">
          <NavLink to="/">计数器</NavLink>
          <NavLink to="/click-outside">点击外部测试</NavLink>
        </nav>
      </header>
      <Routes>
        <Route path="/" element={<CounterPage />} />
        <Route path="/click-outside" element={<ClickOutsidePage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </div>
  )
}

export default App
