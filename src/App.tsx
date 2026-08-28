import { useState } from 'react'
import { NavLink, Navigate, Route, Routes } from 'react-router-dom'
import { ClickOutsidePage } from './pages/ClickOutsidePage'
import { CounterPage } from './pages/CounterPage'
import { RenderFlowPage } from './pages/RenderFlowPage'

type ExampleItem = { label: string; description: string; path?: string; badge?: string }
type ExampleGroup = { id: string; label: string; icon: string; items: ExampleItem[] }

const exampleGroups: ExampleGroup[] = [
  {
    id: 'react', label: 'React 基础', icon: 'R',
    items: [{ label: 'Redux 计数器', description: '全局状态与 Redux Toolkit', path: '/examples/counter', badge: 'Redux' }],
  },
  {
    id: 'hooks', label: '自定义 Hooks', icon: 'H',
    items: [
      { label: '点击外部', description: 'useClickOutside 实战', path: '/examples/click-outside', badge: 'Hook' },
      { label: '防抖与节流', description: '等待添加示例', badge: 'Soon' },
      { label: '本地存储', description: '等待添加示例', badge: 'Soon' },
    ],
  },
  {
    id: 'async', label: '异步与请求', icon: 'A',
    items: [
      { label: '数据请求', description: '等待添加示例', badge: 'Soon' },
      { label: '错误处理', description: '等待添加示例', badge: 'Soon' },
    ],
  },
  {
    id: 'performance', label: '性能优化', icon: 'P',
    items: [{ label: '渲染流程', description: 'State 到 DOM 的完整过程', path: '/examples/render-flow', badge: 'React' }],
  },
]

function App() {
  const [openGroups, setOpenGroups] = useState(() => new Set(['react', 'hooks']))
  const [sidebarOpen, setSidebarOpen] = useState(false)

  const toggleGroup = (groupId: string) => {
    setOpenGroups((current) => {
      const next = new Set(current)
      if (next.has(groupId)) {
        next.delete(groupId)
      } else {
        next.add(groupId)
      }
      return next
    })
  }

  return (
    <div className="app-shell">
      <header className="topbar">
        <button className="menu-button" type="button" aria-label="打开示例导航" aria-expanded={sidebarOpen} onClick={() => setSidebarOpen((open) => !open)}>
          <span /><span /><span />
        </button>
        <div className="brand-block">
          <span className="brand-mark">&lt;/&gt;</span>
          <div><span className="brand">Code Playground</span><small>React 示例工作台</small></div>
        </div>
        <div className="topbar-status"><span className="status-dot" />本地开发环境</div>
      </header>

      <div className="workspace">
        {sidebarOpen && <button className="sidebar-backdrop" type="button" aria-label="关闭示例导航" onClick={() => setSidebarOpen(false)} />}
        <aside className={`sidebar ${sidebarOpen ? 'sidebar-open' : ''}`}>
          <div className="sidebar-heading"><span>代码示例</span><span className="example-count">{exampleGroups.length} 组</span></div>
          <nav className="example-nav" aria-label="代码示例导航">
            {exampleGroups.map((group) => {
              const expanded = openGroups.has(group.id)
              return (
                <section className="nav-group" key={group.id}>
                  <button className="nav-group-button" type="button" aria-expanded={expanded} onClick={() => toggleGroup(group.id)}>
                    <span className="group-icon">{group.icon}</span><span>{group.label}</span><span className={`chevron ${expanded ? 'expanded' : ''}`}>›</span>
                  </button>
                  {expanded && (
                    <div className="sub-tabs">
                      {group.items.map((item) => item.path ? (
                        <NavLink className={({ isActive }) => `sub-tab ${isActive ? 'active' : ''}`} key={item.label} to={item.path} onClick={() => setSidebarOpen(false)}>
                          <span className="sub-tab-copy"><strong>{item.label}</strong><small>{item.description}</small></span>
                          {item.badge && <span className="tab-badge">{item.badge}</span>}
                        </NavLink>
                      ) : (
                        <div className="sub-tab disabled" key={item.label} aria-disabled="true">
                          <span className="sub-tab-copy"><strong>{item.label}</strong><small>{item.description}</small></span>
                          {item.badge && <span className="tab-badge muted">{item.badge}</span>}
                        </div>
                      ))}
                    </div>
                  )}
                </section>
              )
            })}
          </nav>
          <div className="sidebar-footer"><span className="footer-icon">＋</span><span><strong>添加新示例</strong><small>在 exampleGroups 中配置</small></span></div>
        </aside>

        <main className="content-area">
          <Routes>
            <Route path="/examples/counter" element={<CounterPage />} />
            <Route path="/examples/click-outside" element={<ClickOutsidePage />} />
            <Route path="/examples/render-flow" element={<RenderFlowPage />} />
            <Route path="/" element={<Navigate to="/examples/counter" replace />} />
            <Route path="*" element={<Navigate to="/examples/counter" replace />} />
          </Routes>
        </main>
      </div>
    </div>
  )
}

export default App
