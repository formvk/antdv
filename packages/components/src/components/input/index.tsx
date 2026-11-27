import { LoadingOutlined } from '@antdv-next/icons'
import { connect, mapReadPretty, useField } from '@formvk/vue'
import { Input as AntInput, TextArea as AntTextArea } from 'antdv-next'
import type { InputProps, TextAreaProps } from 'antdv-next'
import { defineComponent } from 'vue'
import type { PropType } from 'vue'

import { useFieldModel } from '../../shared'
import { TextInput } from '../preview-text'

const modelProp = { type: null as unknown as PropType<any>, default: undefined }

const InputWrapper = defineComponent<InputProps>({
  name: 'Input',
  inheritAttrs: false,
  props: {
    modelValue: modelProp,
  },
  emits: ['update:modelValue', 'update:value'],
  setup(props, { attrs, slots, emit }) {
    const field = useField()
    const { value, setValue } = useFieldModel(props, attrs, emit)
    return () => (
      <AntInput {...attrs} value={value.value} onUpdate:value={setValue}>
        {{
          ...slots,
          suffix: () => {
            const currentField = field.value as any
            if (currentField?.loading || currentField?.validating) {
              return <LoadingOutlined spin />
            }
            return slots.suffix?.()
          },
        }}
      </AntInput>
    )
  },
})

const TextAreaWrapper = defineComponent<TextAreaProps>({
  name: 'TextArea',
  inheritAttrs: false,
  props: {
    modelValue: modelProp,
  },
  emits: ['update:modelValue', 'update:value'],
  setup(props, { attrs, emit }) {
    const { value, setValue } = useFieldModel(props, attrs, emit)
    return () => <AntTextArea {...attrs} value={value.value} onUpdate:value={setValue} />
  },
})

export const Input = connect(InputWrapper, mapReadPretty(TextInput))

export const TextArea = connect(TextAreaWrapper, mapReadPretty(TextInput))
