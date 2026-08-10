# React + Redux + TypeScript

基于 Vite 的 React 前端项目，使用 Redux Toolkit 管理全局状态。

## 启动

```bash
npm install
npm run dev
```

## 常用命令

- `npm run dev`：启动开发服务器
- `npm run build`：类型检查并构建生产版本
- `npm run lint`：运行 ESLint
- `npm run preview`：预览生产构建

## 目录结构

```text
src/
├── app/                 # Redux store 与类型化 hooks
├── features/            # 按业务功能组织的 Redux slices
├── App.tsx
├── index.css
└── main.tsx
```
