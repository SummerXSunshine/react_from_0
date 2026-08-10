# TypeScript 入门：需要知道的问题

## 1. 基础类型怎么写？

```ts
const username: string = '小明'
const age: number = 18
const enabled: boolean = true

// 推荐让 TypeScript 自动推断
const title = 'TypeScript'
const count = 1
```

## 2. 数组、元组和对象怎么写？

```ts
const names: string[] = ['小明', '小红']
const scores: Array<number> = [90, 95]
const position: [number, number] = [120, 30]

type User = {
  id: number
  name: string
  email?: string
  readonly createdAt: string
}
```

## 3. `type` 和 `interface` 怎么选？

```ts
interface User {
  id: number
  name: string
}

type Product = { id: number; price: number }
type Status = 'idle' | 'loading' | 'success' | 'error'
type Point = [number, number]
```

对象二者都可；联合类型、元组使用 `type`。

## 4. 函数类型怎么写？

```ts
function add(a: number, b: number): number {
  return a + b
}

function search(keyword: string, page?: number) {
  return { keyword, page: page ?? 1 }
}

type Calculate = (a: number, b: number) => number
const multiply: Calculate = (a, b) => a * b
```

## 5. 联合类型和字面量类型怎么用？

```ts
type Id = string | number
type Size = 'small' | 'medium' | 'large'

function load(id: Id, size: Size) {
  return { id, size }
}
```

## 6. 如何缩小类型范围？

```ts
function format(value: string | number) {
  if (typeof value === 'number') return value.toFixed(2)
  return value.trim()
}

type Result =
  | { status: 'success'; data: string[] }
  | { status: 'error'; message: string }

function print(result: Result) {
  if (result.status === 'success') console.log(result.data)
  else console.error(result.message)
}
```

## 7. `any`、`unknown` 和 `never` 怎么用？

```ts
// any 会关闭检查，尽量避免
let unsafe: any = 'hello'

// unknown 使用前必须检查
function print(value: unknown) {
  if (typeof value === 'string') console.log(value.toUpperCase())
}

// never 表示不会正常返回
function fail(message: string): never {
  throw new Error(message)
}
```

## 8. 泛型是什么？

```ts
function first<T>(items: T[]): T | undefined {
  return items[0]
}

const name = first(['小明', '小红'])

type ApiResponse<T> = {
  code: number
  data: T
  message: string
}

type UserResponse = ApiResponse<User>
```

## 9. 泛型约束怎么写？

```ts
function getId<T extends { id: string | number }>(value: T) {
  return value.id
}

getId({ id: 1, name: '小明' })
```

## 10. `keyof` 怎么用？

```ts
function getValue<T, K extends keyof T>(object: T, key: K): T[K] {
  return object[key]
}

const user = { id: 1, name: '小明' }
const name = getValue(user, 'name')
```

## 11. 常用工具类型有哪些？

```ts
type UserPatch = Partial<User>
type CompleteUser = Required<UserPatch>
type ReadonlyUser = Readonly<User>
type UserPreview = Pick<User, 'id' | 'name'>
type UserWithoutEmail = Omit<User, 'email'>
type UsersById = Record<number, User>
```

## 12. 类型断言和非空断言怎么用？

```ts
const input = document.querySelector('#name') as HTMLInputElement | null
input?.focus()

const root = document.getElementById('root')!
```

更安全：

```ts
const root = document.getElementById('root')
if (!root) throw new Error('未找到根节点')
```

## 13. `?.` 和 `??` 怎么用？

```ts
const city = user.address?.city
const displayName = user.nickname ?? user.name

0 || 10 // 10
0 ?? 10 // 0
```

## 14. `enum` 可以怎么替代？

```ts
const Role = {
  Admin: 'admin',
  Editor: 'editor',
  Viewer: 'viewer',
} as const

type Role = (typeof Role)[keyof typeof Role]
```

## 15. `as const` 和 `satisfies` 怎么用？

```ts
const routes = ['/home', '/users'] as const
type Route = (typeof routes)[number]

type Config = { apiUrl: string; timeout: number }

const config = {
  apiUrl: '/api',
  timeout: 5000,
} satisfies Config
```

## 16. Promise 和错误怎么标注？

```ts
async function getUser(id: number): Promise<User> {
  const response = await fetch(`/api/users/${id}`)
  if (!response.ok) throw new Error('请求失败')
  return response.json() as Promise<User>
}

try {
  await getUser(1)
} catch (error: unknown) {
  if (error instanceof Error) console.error(error.message)
}
```

## 17. React Props 怎么定义？

```tsx
import type { ReactNode } from 'react'

type ButtonProps = {
  children: ReactNode
  variant?: 'primary' | 'secondary'
  onClick: () => void
}

function Button({ children, variant = 'primary', onClick }: ButtonProps) {
  return <button className={variant} onClick={onClick}>{children}</button>
}
```

## 18. React 事件怎么定义？

```tsx
import type { ChangeEvent, FormEvent } from 'react'

const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
  console.log(event.target.value)
}

const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
  event.preventDefault()
}
```

## 19. React State 和 Ref 怎么定义？

```tsx
type User = { id: number; name: string }

const [user, setUser] = useState<User | null>(null)
const inputRef = useRef<HTMLInputElement>(null)
```

## 20. Redux Toolkit 的类型怎么定义？

```ts
export const store = configureStore({ reducer: { counter: counterReducer } })

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch

export const useAppDispatch = useDispatch.withTypes<AppDispatch>()
export const useAppSelector = useSelector.withTypes<RootState>()
```

## 21. 为什么使用 `import type`？

```ts
import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'
```

类型导入会在编译后移除，不会成为运行时代码。

