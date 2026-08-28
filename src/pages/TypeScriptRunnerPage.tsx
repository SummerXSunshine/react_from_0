import { type KeyboardEvent, useMemo, useState } from 'react'

const starterCode = `type User = {
  name: string
  scores: number[]
}

function main(user: User) {
  const total = user.scores.reduce((sum, score) => sum + score, 0)
  const average = total / user.scores.length

  return {
    greeting: \`Hello, \${user.name}!\`,
    average: Number(average.toFixed(1)),
    passed: average >= 60,
  }
}`

const starterInput = `{
  "name": "Ada",
  "scores": [92, 86, 95]
}`

type RunState = {
  status: 'idle' | 'running' | 'success' | 'error'
  output: string
  duration?: number
}

function createRunnerWorker() {
  const workerSource = `
    self.onmessage = async ({ data }) => {
      const logs = [];
      const runtimeConsole = {
        log: (...values) => logs.push(values.map(format).join(' ')),
        warn: (...values) => logs.push('[warn] ' + values.map(format).join(' ')),
        error: (...values) => logs.push('[error] ' + values.map(format).join(' ')),
      };

      function format(value) {
        if (typeof value === 'string') return value;
        try { return JSON.stringify(value, null, 2); } catch { return String(value); }
      }

      try {
        const execute = new Function('input', 'console', data.source + '\\nif (typeof main !== "function") { throw new Error("请定义 function main(input) 作为运行入口") }\\nreturn main(input)');
        const result = await execute(data.input, runtimeConsole);
        self.postMessage({ ok: true, result: format(result), logs });
      } catch (error) {
        self.postMessage({ ok: false, error: error instanceof Error ? error.message : String(error), logs });
      }
    };
  `
  return new Worker(URL.createObjectURL(new Blob([workerSource], { type: 'text/javascript' })))
}

export function TypeScriptRunnerPage() {
  const [code, setCode] = useState(starterCode)
  const [input, setInput] = useState(starterInput)
  const [runState, setRunState] = useState<RunState>({ status: 'idle', output: '点击“运行代码”查看函数返回值。' })
  const lineNumbers = useMemo(() => Array.from({ length: code.split('\n').length }, (_, index) => index + 1), [code])

  const runCode = async () => {
    const startedAt = performance.now()
    setRunState({ status: 'running', output: '正在编译并运行…' })

    try {
      const parsedInput: unknown = JSON.parse(input)
      const ts = await import('typescript')
      const compiled = ts.transpileModule(code, {
        compilerOptions: {
          target: ts.ScriptTarget.ES2022,
          module: ts.ModuleKind.None,
          strict: true,
        },
        reportDiagnostics: true,
      })

      const errors = compiled.diagnostics?.filter((diagnostic) => diagnostic.category === ts.DiagnosticCategory.Error) ?? []
      if (errors.length > 0) {
        const message = errors.map((diagnostic) => ts.flattenDiagnosticMessageText(diagnostic.messageText, '\n')).join('\n')
        throw new Error(message)
      }

      const worker = createRunnerWorker()
      const timeout = window.setTimeout(() => {
        worker.terminate()
        setRunState({ status: 'error', output: '运行超过 3 秒，已自动终止。请检查是否存在死循环。' })
      }, 3000)

      worker.onmessage = (event: MessageEvent<{ ok: boolean; result?: string; error?: string; logs: string[] }>) => {
        window.clearTimeout(timeout)
        worker.terminate()
        const duration = performance.now() - startedAt
        const logs = event.data.logs.length ? `Console\n${event.data.logs.join('\n')}\n\n` : ''
        setRunState({
          status: event.data.ok ? 'success' : 'error',
          output: event.data.ok ? `${logs}Return value\n${event.data.result ?? 'undefined'}` : `${logs}${event.data.error ?? '运行失败'}`,
          duration,
        })
      }
      worker.postMessage({ source: compiled.outputText, input: parsedInput })
    } catch (error) {
      setRunState({ status: 'error', output: error instanceof Error ? error.message : String(error), duration: performance.now() - startedAt })
    }
  }

  const handleEditorKeyDown = (event: KeyboardEvent<HTMLTextAreaElement>) => {
    if ((event.ctrlKey || event.metaKey) && event.key === 'Enter') {
      event.preventDefault()
      void runCode()
      return
    }
    if (event.key !== 'Tab') return
    event.preventDefault()
    const target = event.currentTarget
    const start = target.selectionStart
    const end = target.selectionEnd
    const nextCode = `${code.slice(0, start)}  ${code.slice(end)}`
    setCode(nextCode)
    requestAnimationFrame(() => {
      target.selectionStart = target.selectionEnd = start + 2
    })
  }

  return (
    <div className="runner-page">
      <header className="runner-header">
        <div>
          <p className="eyebrow">TypeScript Playground</p>
          <h1>TypeScript 函数运行器</h1>
          <p>编写 <code>main(input)</code> 函数，输入 JSON 参数并直接运行。</p>
        </div>
        <button className="run-button" type="button" onClick={() => void runCode()} disabled={runState.status === 'running'}>
          <span aria-hidden="true">▶</span>
          {runState.status === 'running' ? '运行中…' : '运行代码'}
        </button>
      </header>

      <div className="runner-grid">
        <section className="editor-panel">
          <div className="panel-toolbar">
            <div className="window-dots" aria-hidden="true"><i /><i /><i /></div>
            <span>main.ts</span>
            <small>Ctrl + Enter 运行</small>
          </div>
          <div className="code-editor-wrap">
            <div className="line-numbers" aria-hidden="true">{lineNumbers.map((line) => <span key={line}>{line}</span>)}</div>
            <textarea
              className="code-editor"
              aria-label="TypeScript 代码"
              value={code}
              onChange={(event) => setCode(event.target.value)}
              onKeyDown={handleEditorKeyDown}
              spellCheck={false}
            />
          </div>
        </section>

        <div className="runner-side">
          <section className="input-panel">
            <div className="panel-toolbar"><span>JSON 输入</span><small>传入 main 的参数</small></div>
            <textarea className="json-editor" aria-label="JSON 输入参数" value={input} onChange={(event) => setInput(event.target.value)} spellCheck={false} />
          </section>

          <section className={`output-panel output-${runState.status}`} aria-live="polite">
            <div className="panel-toolbar">
              <span>运行结果</span>
              {runState.duration !== undefined && <small>{runState.duration.toFixed(1)} ms</small>}
            </div>
            <pre>{runState.output}</pre>
          </section>
        </div>
      </div>

      <p className="runner-note"><strong>运行约定：</strong>入口函数必须命名为 <code>main</code>；支持同步或 async 函数。代码在独立 Worker 中执行，超过 3 秒会自动终止。</p>
    </div>
  )
}
