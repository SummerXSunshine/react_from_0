# 业务 Hooks TODO

目标：通过实际业务例子练习 React、TypeScript 与 Redux。每个 Hook 完成后补充类型、清理逻辑、使用示例，并通过 `npm run build` 和 `npm run lint`。

## 请求与路由状态

- [ ] **1. `useRequest` — 通用异步请求**
  - 场景：加载用户列表，统一管理加载、错误、刷新和取消请求。
  - 建议 API：`const { data, loading, error, run, refresh, cancel } = useRequest(getUsers)`

- [ ] **2. `usePagination` — 分页管理**
  - 场景：后台订单列表切换页码和每页数量。
  - 建议 API：`const { page, pageSize, setPage, setPageSize, reset } = usePagination()`

- [ ] **3. `useSearchParamsState` — 多个查询条件同步到 URL**
  - 场景：将用户列表的关键词、状态、页码和排序统一保存到查询参数。
  - 建议 API：`const [filters, setFilters] = useSearchParamsState(defaultFilters)`

- [ ] **4. `useUrlState` — 单个状态同步到 URL**
  - 场景：单独管理 `?page=2` 或 `?keyword=React`。
  - 建议 API：`const [page, setPage] = useUrlState('page', 1)`

- [ ] **5. `useFormDraft` — 表单草稿**
  - 场景：编辑文章时自动保存未提交内容，刷新页面后恢复。
  - 建议 API：`const { draft, saveDraft, clearDraft } = useFormDraft('article-form', initialValues)`

## 弹窗与页面交互

- [ ] **6. `useDisclosure` — 打开与关闭状态**
  - 场景：统一管理 Modal、Drawer 和下拉菜单。
  - 建议 API：`const { open, onOpen, onClose, onToggle } = useDisclosure()`

- [ ] **7. `useEscapeKey` — 按 Esc 关闭**
  - 场景：用户按下 Esc 时关闭弹窗或图片预览。
  - 建议 API：`useEscapeKey(onClose, open)`

- [ ] **8. `useEventListener` — 通用事件监听**
  - 场景：监听键盘、窗口缩放或自定义 DOM 事件，并自动清理。
  - 建议 API：`useEventListener(window, 'resize', handleResize)`

- [ ] **9. `useMediaQuery` — 响应式媒体查询**
  - 场景：根据屏幕宽度切换桌面端和移动端布局。
  - 建议 API：`const mobile = useMediaQuery('(max-width: 768px)')`

- [ ] **10. `useSelection` — 列表多选**
  - 场景：表格批量选择用户并执行删除或导出。
  - 建议 API：`const { selectedKeys, toggle, toggleAll, clear } = useSelection<string>()`

## 浏览器状态与定时任务

- [ ] **11. `useCountdown` — 倒计时**
  - 场景：发送验证码后显示 60 秒倒计时。
  - 建议 API：`const { count, running, start, reset } = useCountdown(60)`

- [ ] **12. `useOnlineStatus` — 网络状态**
  - 场景：断网时显示离线提示，恢复网络后重新请求数据。
  - 建议 API：`const online = useOnlineStatus()`

- [ ] **13. `useInterval` — 可暂停的定时任务**
  - 场景：每 5 秒刷新订单处理状态。
  - 建议 API：`useInterval(refreshOrder, polling ? 5000 : null)`

- [ ] **14. `usePageVisibility` — 页面可见状态**
  - 场景：切换到后台标签页时暂停轮询，回来后恢复。
  - 建议 API：`const visible = usePageVisibility()`

- [ ] **15. `useUnsavedChanges` — 未保存内容提醒**
  - 场景：编辑表单后刷新浏览器或切换路由时提示用户。
  - 建议 API：`useUnsavedChanges(formChanged, '内容尚未保存，确定离开吗？')`

## 用户、权限与复杂业务

- [ ] **16. `useCurrentUser` — 当前用户 Redux Hook**
  - 场景：从 Redux 获取当前用户，并封装刷新和退出操作。
  - 建议 API：`const { user, loading, refresh, logout } = useCurrentUser()`

- [ ] **17. `usePermission` — 权限判断**
  - 场景：只有具备 `user:delete` 权限时才展示删除按钮。
  - 建议 API：`const canDelete = usePermission('user:delete')`

- [ ] **18. `useFileUpload` — 文件上传**
  - 场景：上传头像或附件，展示进度并允许取消。
  - 建议 API：`const { upload, progress, uploading, error, cancel } = useFileUpload()`

- [ ] **19. `useWebSocket` — 实时连接**
  - 场景：接收聊天消息或订单状态推送，并支持断线重连。
  - 建议 API：`const { connected, lastMessage, send, reconnect } = useWebSocket<Message>(url)`

- [ ] **20. `useOptimisticUpdate` — 乐观更新**
  - 场景：点赞后立即更新 Redux 状态，请求失败时自动回滚。
  - 建议 API：`const { execute, pending } = useOptimisticUpdate({ action, optimistic, rollback })`

## 每项完成标准

- [ ] Hook 放入 `src/hooks` 并从 `src/hooks/index.ts` 导出。
- [ ] 使用泛型或明确类型，避免 `any`。
- [ ] 正确清理定时器、事件监听和网络连接。
- [ ] 添加一个可操作的实际业务测试页面。
- [ ] 在 `src/hooks/README.md` 中添加调用示例。
- [ ] 通过 TypeScript 构建和 ESLint 检查。

> `useSearchParamsState` 管理完整查询对象，`useUrlState` 管理单个 URL 参数；实现后可根据重复程度决定是否合并。
