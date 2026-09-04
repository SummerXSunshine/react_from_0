import type { ComponentProps, ReactNode } from 'react'
import {
  Button,
  Checkbox,
  DatePicker,
  Form,
  Input,
  InputNumber,
  Radio,
  Select,
  Space,
  Switch,
  type ButtonProps,
  type DatePickerProps,
  type FormInstance,
  type FormItemProps,
  type FormProps as AntdFormProps,
  type InputNumberProps,
  type InputProps,
  type RadioGroupProps,
  type SelectProps,
  type SwitchProps,
} from 'antd'

export type BaseFormRenderType =
  | 'input'
  | 'textarea'
  | 'inputNumber'
  | 'select'
  | 'datePicker'
  | 'radio'
  | 'checkboxGroup'
  | 'switch'
  | 'custom'

export type BaseFormOption = {
  label: ReactNode
  value: string | number
  disabled?: boolean
}

type FormField<TValues extends object> = Extract<keyof TValues, string>

type CommonFormItem<TValues extends object> = {
  prop: FormField<TValues>
  label: ReactNode
  rules?: FormItemProps<TValues>['rules']
  formItemProps?: Omit<
    FormItemProps<TValues>,
    'children' | 'label' | 'name' | 'rules'
  >
}

export type BaseFormItem<TValues extends object> =
  | (CommonFormItem<TValues> & {
      renderType: 'input'
      controlProps?: InputProps
    })
  | (CommonFormItem<TValues> & {
      renderType: 'textarea'
      controlProps?: ComponentProps<typeof Input.TextArea>
    })
  | (CommonFormItem<TValues> & {
      renderType: 'inputNumber'
      controlProps?: InputNumberProps
    })
  | (CommonFormItem<TValues> & {
      renderType: 'select'
      options: BaseFormOption[]
      controlProps?: SelectProps
    })
  | (CommonFormItem<TValues> & {
      renderType: 'datePicker'
      controlProps?: DatePickerProps
    })
  | (CommonFormItem<TValues> & {
      renderType: 'radio'
      options: BaseFormOption[]
      controlProps?: RadioGroupProps
    })
  | (CommonFormItem<TValues> & {
      renderType: 'checkboxGroup'
      options: BaseFormOption[]
      controlProps?: ComponentProps<typeof Checkbox.Group>
    })
  | (CommonFormItem<TValues> & {
      renderType: 'switch'
      controlProps?: SwitchProps
    })
  | (CommonFormItem<TValues> & {
      renderType: 'custom'
      render: (form: FormInstance<TValues>) => ReactNode
    })

export type BaseFormItems<TValues extends object> = Record<
  string,
  BaseFormItem<TValues>
>

export type BaseFormProps<TValues extends object> = Omit<
  AntdFormProps<TValues>,
  'children'
> & {
  formItems: BaseFormItems<TValues>
  submitText?: ReactNode
  resetText?: ReactNode
  showActions?: boolean
  showReset?: boolean
  submitButtonProps?: ButtonProps
  resetButtonProps?: ButtonProps
}

function renderControl<TValues extends object>(
  item: BaseFormItem<TValues>,
  form: FormInstance<TValues>,
) {
  switch (item.renderType) {
    case 'input':
      return <Input {...item.controlProps} />
    case 'textarea':
      return <Input.TextArea {...item.controlProps} />
    case 'inputNumber':
      return <InputNumber style={{ width: '100%' }} {...item.controlProps} />
    case 'select':
      return <Select options={item.options} {...item.controlProps} />
    case 'datePicker':
      return <DatePicker style={{ width: '100%' }} {...item.controlProps} />
    case 'radio':
      return <Radio.Group options={item.options} {...item.controlProps} />
    case 'checkboxGroup':
      return <Checkbox.Group options={item.options} {...item.controlProps} />
    case 'switch':
      return <Switch {...item.controlProps} />
    case 'custom':
      return item.render(form)
  }
}

export function BaseForm<TValues extends object>({
  formItems,
  form: externalForm,
  submitText = '提交',
  resetText = '重置',
  showActions = true,
  showReset = true,
  submitButtonProps,
  resetButtonProps,
  ...formProps
}: BaseFormProps<TValues>) {
  const [createdForm] = Form.useForm<TValues>()
  const form = externalForm ?? createdForm

  return (
    <Form<TValues> {...formProps} form={form}>
      {Object.entries(formItems).map(([key, item]) => (
        <Form.Item<TValues>
          {...item.formItemProps}
          key={key}
          name={item.prop as FormItemProps<TValues>['name']}
          label={item.label}
          rules={item.rules}
          valuePropName={
            item.formItemProps?.valuePropName ??
            (item.renderType === 'switch' ? 'checked' : 'value')
          }
        >
          {renderControl(item, form)}
        </Form.Item>
      ))}

      {showActions && (
        <Form.Item>
          <Space>
            <Button type="primary" htmlType="submit" {...submitButtonProps}>
              {submitText}
            </Button>
            {showReset && (
              <Button
                htmlType="button"
                onClick={() => form.resetFields()}
                {...resetButtonProps}
              >
                {resetText}
              </Button>
            )}
          </Space>
        </Form.Item>
      )}
    </Form>
  )
}
