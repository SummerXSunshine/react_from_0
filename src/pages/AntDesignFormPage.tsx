import { useState } from 'react'
import { Card, Form, type FormProps } from 'antd'
import type { Dayjs } from 'dayjs'
import { BaseForm, type BaseFormItems } from '../components/baseForm'
import { useTestHook } from '../hooks'

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

const formItems = {
  title: {
    prop: 'title',
    label: '示例名称',
    renderType: 'input',
    rules: [{ required: true, message: '请输入示例名称' }],
    controlProps: {
      size: 'large',
      placeholder: '例如：React 状态更新',
      allowClear: true,
    },
  },
  date: {
    prop: 'date',
    label: '计划日期',
    renderType: 'datePicker',
    rules: [{ required: true, message: '请选择计划日期' }],
    controlProps: {
      size: 'large',
      placeholder: '选择日期',
      format: 'YYYY-MM-DD',
    },
  },
  category: {
    prop: 'category',
    label: '示例分类',
    renderType: 'select',
    rules: [{ required: true, message: '请选择示例分类' }],
    options: [
      { value: 'frontend', label: '前端开发' },
      { value: 'backend', label: '后端开发' },
      { value: 'tooling', label: '工程化工具' },
    ],
    controlProps: {
      size: 'large',
      placeholder: '选择分类',
    },
  },
} satisfies BaseFormItems<FormValues>

export function AntDesignFormPage() {
  const [form] = Form.useForm<FormValues>()
  const [submitted, setSubmitted] = useState<SubmittedValues | null>(null)
  const title = Form.useWatch('title', form) ?? ''

  useTestHook(title)

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
        <p>使用 BaseForm 配置生成 Input、DatePicker 与 Select 控件。</p>
      </header>

      <Card className="antd-form-card" bordered={false}>
        <BaseForm<FormValues>
          form={form}
          formItems={formItems}
          layout="vertical"
          requiredMark="optional"
          onFinish={handleFinish}
          initialValues={{ category: 'frontend' }}
          submitText="提交表单"
          submitButtonProps={{ size: 'large' }}
        />

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
