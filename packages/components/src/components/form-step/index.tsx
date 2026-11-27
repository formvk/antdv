import type { Form, VoidField } from '@formvk/core'
import type { Schema, SchemaKey } from '@formvk/schema'
import { RecursionField, useField, useFieldSchema } from '@formvk/vue'
import { Steps } from 'antdv-next'
import type { StepsProps } from 'antdv-next'
import { computed, defineComponent, h, reactive, watchEffect } from 'vue'
import type { CSSProperties, PropType } from 'vue'

import { cls, isComponentOf, usePrefixCls } from '../../shared'

export interface IFormStep {
  connect: (steps: SchemaStep[], field: VoidField) => void
  current: number
  allowNext: boolean
  allowBack: boolean
  /** 读取实时步骤索引；schema 编译会复制普通属性，方法可保持响应式追踪 */
  getCurrent(): number
  setCurrent(key: number): void
  submit: Form['submit']
  next(): void
  back(): void
}

export interface IFormStepProps {
  formStep?: IFormStep
  current?: number
  style?: CSSProperties
}

type SchemaStep = {
  name: SchemaKey
  props: any
  schema: Schema
}

const parseSteps = (schema: Schema | undefined) => {
  const steps: SchemaStep[] = []
  if (!schema) return steps
  schema.mapProperties((stepSchema, name) => {
    if (isComponentOf(stepSchema.component, 'StepPane')) {
      steps.push({
        name,
        props: stepSchema.componentProps,
        schema: stepSchema,
      })
    }
  })
  return steps
}

export const createFormStep = (defaultCurrent = 0): IFormStep => {
  let form: Form | null = null
  let field: VoidField | null = null
  let steps: SchemaStep[] = []

  const setDisplay = (target: number) => {
    const currentStep = steps[target]
    if (!currentStep) return
    steps.forEach(({ name }) => {
      form?.query(`${field?.address}.${name}`).take((stepField: any) => {
        if (name === currentStep.name) {
          stepField.setDisplay('visible')
        } else {
          stepField.setDisplay('hidden')
        }
      })
    })
  }

  // 使用 Vue reactive 承载状态，外部读取 current / allowNext 时具备响应式
  const formStep: IFormStep = reactive({
    connect(nextSteps: SchemaStep[], nextField: VoidField) {
      steps = nextSteps
      form = nextField?.form ?? null
      field = nextField ?? null
    },
    current: defaultCurrent,
    getCurrent() {
      return formStep.current
    },
    setCurrent(key: number) {
      setDisplay(key)
      formStep.current = key
    },
    get allowNext() {
      return formStep.current < steps.length - 1
    },
    get allowBack() {
      return formStep.current > 0
    },
    async next() {
      try {
        await form?.validate()
        if (form?.valid) {
          formStep.setCurrent(formStep.current + 1)
        }
      } catch {
        // 校验失败时停留当前步，无需处理
      }
    },
    async back() {
      if (formStep.allowBack) {
        formStep.setCurrent(formStep.current - 1)
      }
    },
    async submit(onSubmit) {
      return form?.submit?.(onSubmit) as Promise<any>
    },
  })
  return formStep
}

export const FormStep = defineComponent<
  Omit<StepsProps, 'current' | 'items'> & IFormStepProps & { prefixCls?: string }
>({
  name: 'FormStep',
  inheritAttrs: false,
  props: {
    formStep: Object as PropType<IFormStep>,
    current: Number,
    style: Object as PropType<CSSProperties>,
    prefixCls: String,
  },
  setup(props, { attrs }) {
    const field = useField<VoidField>()
    const schema = useFieldSchema()
    const prefixCls = usePrefixCls('step', props)
    const steps = computed(() => parseSteps(schema.value))

    watchEffect(() => {
      if (props.formStep && field.value) {
        props.formStep.connect(steps.value, field.value)
      }
    })

    const current = computed(() => props.current ?? props.formStep?.getCurrent?.() ?? props.formStep?.current ?? 0)

    const renderIcon = (icon: any) => {
      if (!icon) return undefined
      return typeof icon === 'string' ? icon : h(icon)
    }

    const items = computed(() =>
      steps.value.map(({ props: stepProps }) => ({
        title: stepProps.title,
        description: stepProps.description,
        icon: renderIcon(stepProps.icon),
        status: stepProps.status,
      }))
    )

    return () => {
      const { class: _class, style, ...rest } = attrs
      return (
        <div class={cls(prefixCls, attrs.class as string)}>
          <Steps
            {...rest}
            current={current.value}
            items={items.value as any}
            style={{ marginBottom: 10, ...(style as CSSProperties) }}
          />
          {steps.value.map(({ name, schema: stepSchema }, index) => {
            if (index !== current.value) return null
            return <RecursionField key={name} name={name} schema={stepSchema} />
          })}
        </div>
      )
    }
  },
})
