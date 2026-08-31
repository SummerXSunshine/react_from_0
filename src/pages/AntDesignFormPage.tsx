import { useState } from 'react'
import { Button, Card, DatePicker, Form, Input, Select, type FormProps } from 'antd'
import type { Dayjs } from 'dayjs'

type FormValues = {
  title: string
  date: Dayjs
  category: string
}

type SubmittedValues = {
  title: string
  date: string
  category: string
}

const categoryLabels: Record<string, string> = {
  frontend: '前端开发',
  backend: '后端开发',
  tooling: '工程化工具',
}

export function AntDesignFormPage() {
  const [submitted, setSubmitted] = useState<SubmittedValues | null>(null)

  const handleFinish: FormProps<FormValues>['onFinish'] = (values) => {
    setSubmitted({
      title: values.title,
      date: values.date.format('YYYY-MM-DD'),
      category: categoryLabels[values.category] ?? values.category,
    })
  }

  return (
    <div className="antd-form-page">
      <header className="form-page-header">
        <p className="eyebrow">Ant Design</p>
        <h1>示例信息表单</h1>
        <p>使用 Ant Design 的 Input、DatePicker 与 Select 组件完成结构化输入。</p>
      </header>

      <Card className="antd-form-card" bordered={false}>
        <Form<FormValues>
          layout="vertical"
          requiredMark="optional"
          onFinish={handleFinish}
          initialValues={{ category: 'frontend' }}
        >
          <Form.Item name="title" label="示例名称" rules={[{ required: true, message: '请输入示例名称' }]}>
            <Input size="large" placeholder="例如：React 状态更新" allowClear />
          </Form.Item>

          <Form.Item name="date" label="计划日期" rules={[{ required: true, message: '请选择计划日期' }]}>
            <DatePicker size="large" placeholder="选择日期" format="YYYY-MM-DD" style={{ width: '100%' }} />
          </Form.Item>

          <Form.Item name="category" label="示例分类" rules={[{ required: true, message: '请选择示例分类' }]}>
            <Select
              size="large"
              placeholder="选择分类"
              options={[
                { value: 'frontend', label: '前端开发' },
                { value: 'backend', label: '后端开发' },
                { value: 'tooling', label: '工程化工具' },
              ]}
            />
          </Form.Item>

          <Form.Item className="form-submit-row">
            <Button type="primary" htmlType="submit" size="large" block>提交表单</Button>
          </Form.Item>
        </Form>

        {submitted && (
          <div className="form-result" aria-live="polite">
            <span>提交结果</span>
            <dl>
              <div><dt>示例名称</dt><dd>{submitted.title}</dd></div>
              <div><dt>计划日期</dt><dd>{submitted.date}</dd></div>
              <div><dt>示例分类</dt><dd>{submitted.category}</dd></div>
            </dl>
          </div>
        )}
      </Card>
    </div>
  )
}
