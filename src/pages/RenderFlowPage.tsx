const flowSteps = [
  {
    id: 'state',
    number: '01',
    title: 'State',
    subtitle: '状态发生变化',
    description: 'setState、dispatch 或外部 Store 更新，向 React 发出一次更新请求。',
    detail: '产生更新任务',
  },
  {
    id: 'render',
    number: '02',
    title: 'Render',
    subtitle: '重新执行组件',
    description: 'React 调用相关组件函数，根据最新的 props 与 state 生成新的元素树。',
    detail: '生成新 React Tree',
  },
  {
    id: 'diff',
    number: '03',
    title: 'Diff / Reconciliation',
    subtitle: '协调与差异比较',
    description: '比较新旧 Fiber 树，找出需要新增、更新或删除的最小变更集合。',
    detail: '标记 DOM 变更',
  },
  {
    id: 'commit',
    number: '04',
    title: 'Commit',
    subtitle: '提交变更',
    description: 'React 将协调阶段收集到的变更一次性提交，并执行布局相关 Effect。',
    detail: '执行真实更新',
  },
  {
    id: 'dom',
    number: '05',
    title: 'DOM',
    subtitle: '浏览器呈现结果',
    description: '真实 DOM 更新后，浏览器进行样式计算、布局与绘制，用户看到新界面。',
    detail: '页面完成更新',
  },
]

export function RenderFlowPage() {
  return (
    <div className="flow-page">
      <header className="flow-header">
        <p className="eyebrow">React Performance</p>
        <h1>React 渲染流程</h1>
        <p>一次状态更新如何从组件内部，最终变成浏览器中可见的 DOM。</p>
      </header>

      <div className="phase-label render-phase-label">
        <span>Render Phase</span>
        <small>计算过程，可被调度或中断</small>
      </div>

      <ol className="render-flow" aria-label="React 从状态更新到 DOM 的渲染流程">
        {flowSteps.map((step, index) => (
          <li className={`flow-step flow-${step.id}`} key={step.id}>
            {step.id === 'commit' && (
              <div className="phase-label commit-phase-label">
                <span>Commit Phase</span>
                <small>同步提交，不可中断</small>
              </div>
            )}
            <article>
              <div className="step-marker" aria-hidden="true">{step.number}</div>
              <div className="step-main">
                <div className="step-title-row">
                  <h2>{step.title}</h2>
                  <span>{step.subtitle}</span>
                </div>
                <p>{step.description}</p>
              </div>
              <div className="step-output">
                <small>输出</small>
                <strong>{step.detail}</strong>
              </div>
            </article>
            {index < flowSteps.length - 1 && (
              <div className="flow-arrow" aria-hidden="true">
                <span />
                <b>↓</b>
              </div>
            )}
          </li>
        ))}
      </ol>

      <aside className="flow-tip">
        <span className="tip-symbol">i</span>
        <p><strong>性能优化的关键：</strong>减少不必要的 Render 与 Diff，比直接操作 DOM 更值得优先关注。可使用 memo、useMemo、useCallback 和合理的状态拆分降低计算量。</p>
      </aside>
    </div>
  )
}
