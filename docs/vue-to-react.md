# 从 Vue 切换到 React：需要知道的问题

> 示例使用函数组件、Hooks 和 TypeScript。

## 1. 组件和 Props 怎么写？

```tsx
type WelcomeProps = { name: string; age?: number }

export function Welcome({ name, age }: WelcomeProps) {
  return <h1>你好，{name}，{age ?? '年龄未知'}</h1>
}

<Welcome name="小明" age={18} />
```

## 2. `v-if` 和 `v-for` 怎么写？

```tsx
{isLogin ? <p>已登录</p> : <p>请登录</p>}

{users.map((user) => (
  <li key={user.id}>{user.name}</li>
))}
```

## 3. 属性、class 和 style 怎么绑定？

```tsx
<button
  className={active ? 'button active' : 'button'}
  style={{ color: active ? 'white' : 'black' }}
  disabled={loading}
>
  保存
</button>
```

## 4. `ref` 响应式状态怎么写？

```tsx
import { useState } from 'react'

function Counter() {
  const [count, setCount] = useState(0)

  return <button onClick={() => setCount((n) => n + 1)}>{count}</button>
}
```

## 5. 为什么不能直接修改 state？

```tsx
const [user, setUser] = useState({ name: '小明', age: 18 })

// 错误：user.age += 1
setUser((current) => ({ ...current, age: current.age + 1 }))

const [items, setItems] = useState<string[]>([])
setItems((current) => [...current, 'React'])
```

## 6. `computed` 怎么写？

```tsx
// 简单计算直接写
const fullName = `${firstName} ${lastName}`

// 昂贵计算才使用 useMemo
const visibleItems = useMemo(
  () => items.filter((item) => item.visible),
  [items],
)
```

## 7. `watch` 和生命周期怎么写？

```tsx
useEffect(() => {
  document.title = `数量：${count}`
}, [count])

useEffect(() => {
  const controller = new AbortController()
  fetch('/api/users', { signal: controller.signal })

  return () => controller.abort()
}, [])
```

## 8. `emit` 怎么写？

```tsx
type SearchProps = {
  onSearch: (keyword: string) => void
}

function Search({ onSearch }: SearchProps) {
  return <button onClick={() => onSearch('react')}>搜索</button>
}
```

## 9. `v-model` 怎么写？

```tsx
const [name, setName] = useState('')

<input
  value={name}
  onChange={(event) => setName(event.target.value)}
/>

const [agreed, setAgreed] = useState(false)

<input
  type="checkbox"
  checked={agreed}
  onChange={(event) => setAgreed(event.target.checked)}
/>
```

## 10. `slot` 怎么写？

```tsx
import type { ReactNode } from 'react'

type CardProps = {
  title: ReactNode
  children: ReactNode
  footer?: ReactNode
}

function Card({ title, children, footer }: CardProps) {
  return <section><header>{title}</header>{children}{footer}</section>
}

<Card title="用户" footer={<button>保存</button>}>
  <p>正文内容</p>
</Card>
```

## 11. 模板引用和 DOM 操作怎么写？

```tsx
const inputRef = useRef<HTMLInputElement>(null)

<input ref={inputRef} />
<button onClick={() => inputRef.current?.focus()}>聚焦</button>
```

## 12. Composable 怎么迁移？

React 使用自定义 Hook：

```tsx
function useWindowWidth() {
  const [width, setWidth] = useState(window.innerWidth)

  useEffect(() => {
    const update = () => setWidth(window.innerWidth)
    window.addEventListener('resize', update)
    return () => window.removeEventListener('resize', update)
  }, [])

  return width
}

const width = useWindowWidth()
```

## 13. `provide/inject` 怎么写？

```tsx
const ThemeContext = createContext<'light' | 'dark'>('light')

<ThemeContext.Provider value="dark">
  <Page />
</ThemeContext.Provider>

function Page() {
  const theme = useContext(ThemeContext)
  return <div data-theme={theme}>页面</div>
}
```

## 14. Pinia/Vuex 怎么迁移到 Redux Toolkit？

```ts
const userSlice = createSlice({
  name: 'user',
  initialState: { name: '', loggedIn: false },
  reducers: {
    login(state, action: PayloadAction<string>) {
      state.name = action.payload
      state.loggedIn = true
    },
    logout(state) {
      state.name = ''
      state.loggedIn = false
    },
  },
})

export const { login, logout } = userSlice.actions
```

```tsx
const user = useAppSelector((state) => state.user)
const dispatch = useAppDispatch()

dispatch(login('小明'))
```

## 15. 路由怎么写？

```tsx
<BrowserRouter>
  <nav><Link to="/users">用户</Link></nav>
  <Routes>
    <Route path="/" element={<Home />} />
    <Route path="/users" element={<Users />} />
    <Route path="/users/:id" element={<UserDetail />} />
  </Routes>
</BrowserRouter>
```

## 16. Hooks 有哪些规则？

```tsx
// 正确：只在组件或自定义 Hook 顶层调用
const [count, setCount] = useState(0)

// 错误：不能放在条件、循环、事件函数中
if (visible) {
  // const [value, setValue] = useState('')
}
```

## 17. Vue 与 React 概念对照

| Vue | React |
| --- | --- |
| `.vue` 组件 | `.tsx` 函数组件 |
| `ref/reactive` | `useState/useReducer` |
| `computed` | 普通变量 / `useMemo` |
| `watch`、生命周期 | `useEffect` |
| `emit` | 回调 Props |
| `v-model` | `value + onChange` |
| `slot` | `children/ReactNode` |
| `provide/inject` | Context |
| composable | 自定义 Hook |
| Pinia/Vuex | Redux Toolkit |
| Vue Router | React Router |

