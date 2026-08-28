# Hooks 使用示例

## 点击弹窗外部关闭

```tsx
function Dialog() {
  const [open, setOpen] = useState(false)
  const dialogRef = useClickOutside<HTMLDivElement>(
    () => setOpen(false),
    open,
  )

  return (
    <>
      <button onClick={() => setOpen(true)}>打开弹窗</button>
      {open && <div ref={dialogRef}>弹窗内容</div>}
    </>
  )
}
```

## 防抖

```tsx
const debouncedKeyword = useDebounce(keyword, 500)

const save = useDebouncedCallback((value: string) => {
  console.log('保存', value)
}, 500)
```

## 节流

```tsx
const throttledPosition = useThrottle(position, 100)

const handleScroll = useThrottledCallback(() => {
  console.log(window.scrollY)
}, 100)
```

## 本地存储

```tsx
const [theme, setTheme, removeTheme] = useLocalStorage(
  'theme',
  'light' as 'light' | 'dark',
)

setTheme('dark')
setTheme((current) => current === 'dark' ? 'light' : 'dark')
removeTheme()
```

## 其他

```tsx
const previousCount = usePrevious(count)
const [visible, toggleVisible, setVisible] = useToggle(false)
```
