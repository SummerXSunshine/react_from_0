import { useState } from 'react'
import { ConfigProvider, Menu, type MenuProps } from 'antd'
import zhCN from 'antd/locale/zh_CN'
import { Navigate, Route, Routes, useLocation, useNavigate } from 'react-router-dom'
import { AntDesignFormPage } from './pages/AntDesignFormPage'
import { ClickOutsidePage } from './pages/ClickOutsidePage'
import { CounterPage } from './pages/CounterPage'
import { RenderFlowPage } from './pages/RenderFlowPage'
import { TypeScriptRunnerPage } from './pages/TypeScriptRunnerPage'

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
  {
    id: 'tools', label: '在线实验', icon: 'T',
    items: [
      { label: 'TypeScript 运行器', description: '编写并运行 TS 函数', path: '/examples/typescript-runner', badge: 'TS' },
      { label: 'Ant Design 表单', description: '文本、日期与选择输入', path: '/examples/antd-form', badge: 'Form' },
    ],
  },
]

function App() {
  const location = useLocation()
  const navigate = useNavigate()
  const [openGroups, setOpenGroups] = useState<string[]>(['react', 'hooks', 'performance', 'tools'])
  const [sidebarOpen, setSidebarOpen] = useState(false)

  const menuItems: MenuProps['items'] = exampleGroups.map((group) => ({
    key: group.id,
    icon: <span className="antd-group-icon">{group.icon}</span>,
    label: group.label,
    children: group.items.map((item) => ({
      key: item.path ?? `${group.id}-${item.label}`,
      disabled: !item.path,
      label: (
        <span className="antd-menu-label">
          <span><strong>{item.label}</strong><small>{item.description}</small></span>
          {item.badge && <em>{item.badge}</em>}
        </span>
      ),
    })),
  }))

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
            <Menu
              mode="inline"
              items={menuItems}
              selectedKeys={[location.pathname]}
              openKeys={openGroups}
              onOpenChange={setOpenGroups}
              onClick={({ key }) => {
                navigate(key)
                setSidebarOpen(false)
              }}
            />
          </nav>
          <div className="sidebar-footer"><span className="footer-icon">＋</span><span><strong>添加新示例</strong><small>在 exampleGroups 中配置</small></span></div>
        </aside>

        <main className="content-area">
          <Routes>
            <Route path="/examples/counter" element={<CounterPage />} />
            <Route path="/examples/click-outside" element={<ClickOutsidePage />} />
            <Route path="/examples/render-flow" element={<RenderFlowPage />} />
            <Route path="/examples/typescript-runner" element={<TypeScriptRunnerPage />} />
            <Route path="/examples/antd-form" element={<AntDesignFormPage />} />
            <Route path="/" element={<Navigate to="/examples/counter" replace />} />
            <Route path="*" element={<Navigate to="/examples/counter" replace />} />
          </Routes>
        </main>
      </div>
    </div>
  )
}

function ThemedApp() {
  return (
    <ConfigProvider
      locale={zhCN}
      theme={{ token: { colorPrimary: '#4f46e5', borderRadius: 10, fontFamily: 'Inter, ui-sans-serif, system-ui, sans-serif' } }}
    >
      <App />
    </ConfigProvider>
  )
}

export default ThemedApp
